"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await prisma_1.default.service.findMany();
        res.status(200).json(services);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await prisma_1.default.service.findUnique({ where: { id } });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});
exports.default = router;
