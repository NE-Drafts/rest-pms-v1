import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as parkingSlotService from './parking-slot.service';
import { Role } from '../../generated/prisma';

// Get all parking slots
export const getAllParkingSlots = async (req: Request, res: Response) => {
  try {
    const slots = await parkingSlotService.getAllParkingSlots();
    res.json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific parking slot
export const getParkingSlotById = async (req: Request, res: Response) => {
  try {
    const slotId = req.params.id;

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(slotId)) {
      return res.status(400).json({ error: 'Invalid parking slot ID format' });
    }

    const slot = await parkingSlotService.getParkingSlotById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Parking slot not found' });
    }

    res.json(slot);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new parking slot (admin only)
export const createParkingSlot = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const slot = await parkingSlotService.createParkingSlot(req.body);
    res.status(201).json(slot);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a parking slot (admin only)
export const deleteParkingSlot = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const slotId = req.params.id;
    
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(slotId)) {
      return res.status(400).json({ error: 'Invalid parking slot ID format' });
    }

    await parkingSlotService.deleteParkingSlot(slotId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Cannot delete')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
