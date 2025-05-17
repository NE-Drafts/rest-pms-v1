import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { setupSwagger } from './docs/swagger';

// Middleware
import { errorHandler } from './middleware/error.middleware';

// Routes
import userRoutes from './modules/user/user.routes';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import parkingSlotRoutes from './modules/parking-slot/parking-slot.routes';
import reservationRoutes from './modules/reservation/reservation.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/parking-slots', parkingSlotRoutes);
app.use('/api/reservations', reservationRoutes);

// Setup API documentation
setupSwagger(app);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Parking API');
});

// Error handling middleware
app.use(errorHandler);

export default app;
