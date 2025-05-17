import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as reservationService from './reservation.service';
import { Role } from '../../generated/prisma';

/**
 * Create a new reservation request
 */
export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reservation = await reservationService.createReservation(req.user.id, req.body.body);
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all reservations for the current user
 */
export const getUserReservations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reservations = await reservationService.getUserReservations(req.user.id);
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all pending reservations (admin only)
 */
export const getPendingReservations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const reservations = await reservationService.getPendingReservations();
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a reservation by ID
 */
export const getReservationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reservationId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reservationId)) {
      return res.status(400).json({ error: 'Invalid reservation ID format' });
    }

    const reservation = await reservationService.getReservationById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Only admin or the reservation owner can view the reservation
    if (req.user.role !== Role.ADMIN && reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(reservation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a reservation (admin only)
 */
export const approveReservation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const reservationId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reservationId)) {
      return res.status(400).json({ error: 'Invalid reservation ID format' });
    }

    const reservation = await reservationService.approveReservation(
      reservationId,
      req.user.id,
      req.body.body
    );

    res.json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Reject a reservation (admin only)
 */
export const rejectReservation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const reservationId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reservationId)) {
      return res.status(400).json({ error: 'Invalid reservation ID format' });
    }

    const reservation = await reservationService.rejectReservation(reservationId);
    res.json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
