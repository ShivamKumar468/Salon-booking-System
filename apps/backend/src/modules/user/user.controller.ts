import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional().nullable(),
  pronouns: z.string().max(20, 'Pronouns must be under 20 characters').optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

const preferencesUpdateSchema = z.object({
  preferences: z.record(z.any(), { message: 'Preferences must be an object' }),
});

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        pronouns: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = profileUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(err => err.message);
      res.status(400).json({ errors });
      return;
    }

    const updateData = parseResult.data;

    // Filter undefined fields
    const cleanData: any = {};
    if (updateData.name !== undefined) cleanData.name = updateData.name;
    if (updateData.bio !== undefined) cleanData.bio = updateData.bio;
    if (updateData.pronouns !== undefined) cleanData.pronouns = updateData.pronouns;
    if (updateData.avatarUrl !== undefined) cleanData.avatarUrl = updateData.avatarUrl;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: cleanData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        pronouns: true,
        preferences: true,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = preferencesUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { preferences } = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: JSON.stringify(preferences),
      },
      select: {
        id: true,
        preferences: true,
      },
    });

    res.status(200).json({
      message: 'Preferences updated successfully',
      user: {
        id: updatedUser.id,
        preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : {},
      },
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
