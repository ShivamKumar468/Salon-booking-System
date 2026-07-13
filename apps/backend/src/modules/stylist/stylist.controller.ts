import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
const router = Router();

// Get all stylists
router.get('/', async (req: Request, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({ include: { user: true } });
    res.status(200).json(stylists);
  } catch {
    res.status(500).json({ error: 'Failed to fetch stylists' });
  }
});

// Get stylist by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stylist = await prisma.stylist.findUnique({ 
      where: { id }, 
      include: { user: true } 
    });
    if (!stylist) {
      return res.status(404).json({ error: 'Stylist not found' });
    }
    res.status(200).json(stylist);
  } catch {
    res.status(500).json({ error: 'Failed to fetch stylist' });
  }
});

export default router;
