"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const profileUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters long').optional(),
    bio: zod_1.z.string().max(300, 'Bio must be under 300 characters').optional().nullable(),
    pronouns: zod_1.z.string().max(20, 'Pronouns must be under 20 characters').optional().nullable(),
    avatarUrl: zod_1.z.string().optional().nullable(),
});
const preferencesUpdateSchema = zod_1.z.object({
    preferences: zod_1.z.record(zod_1.z.any(), { message: 'Preferences must be an object' }),
});
// Get user profile
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateToken, async (req, res) => {
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
        const cleanData = {};
        if (updateData.name !== undefined)
            cleanData.name = updateData.name;
        if (updateData.bio !== undefined)
            cleanData.bio = updateData.bio;
        if (updateData.pronouns !== undefined)
            cleanData.pronouns = updateData.pronouns;
        if (updateData.avatarUrl !== undefined)
            cleanData.avatarUrl = updateData.avatarUrl;
        const updatedUser = await prisma_1.default.user.update({
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update user preferences
router.put('/preferences', auth_1.authenticateToken, async (req, res) => {
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
        const updatedUser = await prisma_1.default.user.update({
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
    }
    catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
