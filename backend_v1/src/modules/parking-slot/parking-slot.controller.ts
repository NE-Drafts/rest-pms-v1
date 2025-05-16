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

// Get available parking slots for a specific date
export const getAvailableParkingSlots = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date parameter is required (format: YYYY-MM-DD)' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const slots = await parkingSlotService.getAvailableParkingSlots(date);
    res.json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific parking slot
export const getParkingSlotById = async (req: Request, res: Response) => {
  try {
    const slotId = parseInt(req.params.id);
    if (isNaN(slotId)) {
      return res.status(400).json({ error: 'Invalid parking slot ID' });
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

    const slot = await parkingSlotService.createParkingSlot(req.body.body);
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

    const slotId = parseInt(req.params.id);
    if (isNaN(slotId)) {
      return res.status(400).json({ error: 'Invalid parking slot ID' });
    }

    await parkingSlotService.deleteParkingSlot(slotId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
