"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
// Get all stylists
router.get('/', async (req, res) => {
    try {
        const stylists = await prisma_1.default.stylist.findMany({ include: { user: true } });
        res.status(200).json(stylists);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch stylists' });
    }
});
// Get stylist by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const stylist = await prisma_1.default.stylist.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!stylist) {
            return res.status(404).json({ error: 'Stylist not found' });
        }
        res.status(200).json(stylist);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch stylist' });
    }
});
exports.default = router;
