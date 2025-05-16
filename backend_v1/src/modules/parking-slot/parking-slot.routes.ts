import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { parkingSlotSchema } from './parking-slot.validator';
import {
  getAllParkingSlots,
  getAvailableParkingSlots,
  getParkingSlotById,
  createParkingSlot,
  deleteParkingSlot,
} from './parking-slot.controller';

const router = Router();

/**
 * @swagger
 * /api/parking-slots:
 *   get:
 *     summary: Get all parking slots
 *     tags: [Parking Slots]
 *     responses:
 *       200:
 *         description: List of all parking slots
 */
router.get('/', getAllParkingSlots);

/**
 * @swagger
 * /api/parking-slots/available:
 *   get:
 *     summary: Get available parking slots for a specific date
 *     tags: [Parking Slots]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available parking slots
 *       400:
 *         description: Invalid date format
 */
router.get('/available', getAvailableParkingSlots);

/**
 * @swagger
 * /api/parking-slots/{id}:
 *   get:
 *     summary: Get a parking slot by ID
 *     tags: [Parking Slots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parking slot ID
 *     responses:
 *       200:
 *         description: Parking slot details
 *       404:
 *         description: Parking slot not found
 */
router.get('/:id', getParkingSlotById);

/**
 * @swagger
 * /api/parking-slots:
 *   post:
 *     summary: Create a new parking slot (Admin only)
 *     tags: [Parking Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotCode
 *             properties:
 *               slotCode:
 *                 type: string
 *                 description: Unique code for the parking slot (e.g., A1, B2)
 *     responses:
 *       201:
 *         description: Parking slot created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', authMiddleware as any, requireAdmin as any, validate(parkingSlotSchema), createParkingSlot as any);

/**
 * @swagger
 * /api/parking-slots/{id}:
 *   delete:
 *     summary: Delete a parking slot (Admin only)
 *     tags: [Parking Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parking slot ID to delete
 *     responses:
 *       204:
 *         description: Parking slot deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Parking slot not found
 */
router.delete('/:id', authMiddleware as any, requireAdmin as any, deleteParkingSlot as any);

export default router;
