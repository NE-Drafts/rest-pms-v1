import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createReservationSchema, approveReservationSchema } from './reservation.validator';
import {
  createReservation,
  getUserReservations,
  getPendingReservations,
  getReservationById,
  approveReservation,
  rejectReservation,
} from './reservation.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware as any);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new parking reservation request
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - date
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of user's vehicle
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date for the reservation (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Reservation request created successfully
 *       400:
 *         description: Invalid input data or user already has reservation for this date
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createReservationSchema), createReservation as any);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all user's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reservations
 *       401:
 *         description: Unauthorized
 */
router.get('/', getUserReservations as any);

/**
 * @swagger
 * /reservations/pending:
 *   get:
 *     summary: Get all pending reservations (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pending reservations
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/pending', requireAdmin as any, getPendingReservations as any);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', getReservationById as any);

/**
 * @swagger
 * /reservations/{id}/approve:
 *   put:
 *     summary: Approve a reservation and assign a parking slot (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID to approve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parkingSlotId
 *             properties:
 *               parkingSlotId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of parking slot to assign
 *     responses:
 *       200:
 *         description: Reservation approved successfully
 *       400:
 *         description: Invalid input data or slot not available
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Reservation or parking slot not found
 */
router.put('/:id/approve', requireAdmin as any, validate(approveReservationSchema), approveReservation as any);

/**
 * @swagger
 * /reservations/{id}/reject:
 *   put:
 *     summary: Reject a reservation request (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID to reject
 *     responses:
 *       200:
 *         description: Reservation rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Reservation not found
 */
router.put('/:id/reject', requireAdmin as any, rejectReservation as any);

export default router;