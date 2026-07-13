import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Limit to 100 requests per 15 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 points
  duration: 15 * 60, // Per 15 minutes
});

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
