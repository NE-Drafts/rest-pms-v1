// // src/modules/vehicle/vehicle.routes.ts
// import { Router } from 'express';
// import * as vehicleController from './vehicle.controller';
// import { requireAuth } from '../../middleware/auth.middleware';

// const router = Router();

// router.post('/create', requireAuth, vehicleController.registerVehicle);
// router.get('/view', requireAuth, vehicleController.getUserVehicles);
// router.delete('/delete/:id', requireAuth, vehicleController.deleteVehicle);

// export default router;

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validator';
import {
  createVehicle,
  getUserVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from './vehicle.controller';

const router = Router();

// Routes require authentication
router.use(authMiddleware as any);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Register a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate
 *               - model
 *             properties:
 *               plate:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 10
 *               model:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createVehicleSchema), createVehicle as any);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all user's vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's vehicles
 *       401:
 *         description: Unauthorized
 */
router.get('/', getUserVehicles as any);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', getVehicleById as any);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 10
 *               model:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', validate(updateVehicleSchema), updateVehicle as any);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Vehicle ID
 *     responses:
 *       204:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', deleteVehicle as any);

export default router;
