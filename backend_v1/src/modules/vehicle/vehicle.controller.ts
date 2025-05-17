// // src/modules/vehicle/vehicle.controller.ts
// import { Request, Response, NextFunction } from 'express';
// import * as vehicleService from './vehicle.service';

// export const registerVehicle = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { plate, model } = req.body;
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const vehicle = await vehicleService.addVehicle(userId, plate, model);
//     res.status(201).json({ message: 'Vehicle registered', vehicle });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getUserVehicles = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const vehicles = await vehicleService.getUserVehicles(userId);
//     res.status(200).json({ vehicles });
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;
//     const vehicleId = Number(req.params.id);

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const deleted = await vehicleService.deleteUserVehicle(userId, vehicleId);

//     if (deleted.count === 0) {
//       return res.status(404).json({ message: 'Vehicle not found or not owned by user' });
//     }

//     res.status(200).json({ message: 'Vehicle deleted successfully' });
//   } catch (err) {
//     next(err);
//   }
// };

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as vehicleService from './vehicle.service';

// Add a new vehicle
export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicle = await vehicleService.createVehicle(req.user.id, req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all user vehicles
export const getUserVehicles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicles = await vehicleService.getUserVehicles(req.user.id);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific vehicle
export const getVehicleById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicleId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(vehicleId)) {
      return res.status(400).json({ error: 'Invalid vehicle ID format' });
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId, req.user.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a vehicle
export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicleId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(vehicleId)) {
      return res.status(400).json({ error: 'Invalid vehicle ID format' });
    }

    const vehicle = await vehicleService.updateVehicle(
      vehicleId,
      req.user.id,
      req.body.body
    );
    res.json(vehicle);
  } catch (error: any) {
    if (error.message === 'Vehicle not found or does not belong to the user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vehicleId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(vehicleId)) {
      return res.status(400).json({ error: 'Invalid vehicle ID format' });
    }

    await vehicleService.deleteVehicle(vehicleId, req.user.id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Vehicle not found or does not belong to the user') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
