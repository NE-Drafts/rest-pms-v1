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

// Get available parking slots for a specific date
export const getAvailableParkingSlots = async (date: string) => {
  try {
    // Parse the date string to a Date object (YYYY-MM-DD)
    const requestDate = new Date(date);
    requestDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

    // Find all slots that are not assigned to an approved reservation on the given date
    const reservedSlotIds = await prisma.reservation.findMany({
      where: {
        date: requestDate,
        status: 'APPROVED',
      },
      select: {
        parkingSlotId: true,
      },
    });

    // Extract the IDs of reserved slots
    const reservedIds = reservedSlotIds
      .map((reservation) => reservation.parkingSlotId)
      .filter((id): id is number => id !== null);

    // Find all slots that are not in the reserved IDs list
    return await prisma.parkingSlot.findMany({
      where: {
        id: {
          notIn: reservedIds,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// Get a specific parking slot by ID
export const getParkingSlotById = async (slotId: number) => {
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
export const deleteParkingSlot = async (slotId: number) => {
  try {
    return await prisma.parkingSlot.delete({
      where: { id: slotId },
    });
  } catch (error) {
    throw error;
  }
};
