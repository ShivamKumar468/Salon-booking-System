"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
// Limit to 100 requests per 15 minutes per IP
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 100, // 100 points
    duration: 15 * 60, // Per 15 minutes
});
const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    rateLimiter
        .consume(ip)
        .then(() => {
        next();
    })
        .catch(() => {
        res.status(429).json({
            error: 'Too many requests. Please try again after 15 minutes.',
        });
    });
};
exports.rateLimitMiddleware = rateLimitMiddleware;
