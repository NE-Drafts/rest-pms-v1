// src/modules/vehicle/vehicle.service.ts
import { PrismaClient } from '../../generated/prisma';
import { CreateVehicleInput, UpdateVehicleInput } from './vehicle.validator';

const prisma = new PrismaClient();

// Add a new vehicle for a user
export const createVehicle = async (userId: number, data: CreateVehicleInput) => {
  try {
    return await prisma.vehicle.create({
      data: {
        userId,
        plate: data.plate,
        model: data.model,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Get all vehicles for a user
export const getUserVehicles = async (userId: number) => {
  try {
    return await prisma.vehicle.findMany({
      where: { userId },
    });
  } catch (error) {
    throw error;
  }
};

// Get a vehicle by ID
export const getVehicleById = async (vehicleId: number, userId: number) => {
  try {
    return await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId, // Ensure the vehicle belongs to the user
      },
    });
  } catch (error) {
    throw error;
  }
};

// Update a vehicle
export const updateVehicle = async (
  vehicleId: number,
  userId: number,
  data: UpdateVehicleInput
) => {
  try {
    // First check if the vehicle belongs to the user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found or does not belong to the user');
    }

    return await prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  } catch (error) {
    throw error;
  }
};

// Delete a vehicle
export const deleteVehicle = async (vehicleId: number, userId: number) => {
  try {
    // First check if the vehicle belongs to the user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found or does not belong to the user');
    }

    return await prisma.vehicle.delete({
      where: { id: vehicleId },
    });
  } catch (error) {
    throw error;
  }
};
