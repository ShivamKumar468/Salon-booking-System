import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.controller';
import userRouter from './modules/user/user.controller';
import bookingRouter from './modules/booking/booking.controller';
import serviceRouter from './modules/service/service.controller';
import stylistRouter from './modules/stylist/stylist.controller';
import { rateLimitMiddleware } from './middleware/rateLimit';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting globally
app.use(rateLimitMiddleware);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Mounting Module Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/service', serviceRouter);
app.use('/api/stylist', stylistRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Salon Booking Backend is running on port ${PORT}`);
});
