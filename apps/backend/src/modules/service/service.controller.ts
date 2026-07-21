import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
const router = Router();

// Get all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.status(200).json(services);
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

export default router;
