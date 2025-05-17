import { PrismaClient } from '../../generated/prisma';
import { ParkingSlotInput } from './parking-slot.validator';

const prisma = new PrismaClient();

// Get all parking slots
export const getAllParkingSlots = async () => {
  try {
    return await prisma.parkingSlot.findMany();
  } catch (error) {
    throw error;
  }
};

// Get a specific parking slot by ID
export const getParkingSlotById = async (slotId: string) => {
  try {
    return await prisma.parkingSlot.findUnique({
      where: { id: slotId },
    });
  } catch (error) {
    throw error;
  }
};

// Create a new parking slot (admin only)
export const createParkingSlot = async (data: ParkingSlotInput) => {
  try {
    return await prisma.parkingSlot.create({
      data: {
        slotCode: data.slotCode,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Delete a parking slot (admin only)
export const deleteParkingSlot = async (slotId: string) => {
  try {
    // Check if parking slot exists
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { id: slotId },
      include: { reservations: true }
    });

    if (!parkingSlot) {
      throw new Error('Parking slot not found');
    }

    // Check if parking slot has associated reservations
    if (parkingSlot.reservations && parkingSlot.reservations.length > 0) {
      throw new Error('Cannot delete parking slot that has associated reservations');
    }

    return await prisma.parkingSlot.delete({
      where: { id: slotId },
    });
  } catch (error) {
    throw error;
  }
};
