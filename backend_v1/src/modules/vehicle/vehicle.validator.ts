// src/modules/vehicle/vehicle.validator.ts
import { z } from 'zod';

const vehicleBaseSchema = z.object({
  plate: z
    .string()
    .min(5, { message: 'Plate number must be at least 5 characters long.' })
    .max(10, { message: 'Plate number must be at most 10 characters long.' }),
  model: z
    .string()
    .min(2, { message: 'Model must be at least 2 characters long.' })
});

const updateVehicleBaseSchema = z.object({
  plate: z
    .string()
    .min(5, { message: 'Plate number must be at least 5 characters long.' })
    .max(10, { message: 'Plate number must be at most 10 characters long.' })
    .optional(),
  model: z
    .string()
    .min(2, { message: 'Model must be at least 2 characters long.' })
    .optional()
});

export const createVehicleSchema = z.object({
  body: vehicleBaseSchema
});

export const updateVehicleSchema = z.object({
  body: updateVehicleBaseSchema
});

export type CreateVehicleInput = z.infer<typeof vehicleBaseSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleBaseSchema>;
