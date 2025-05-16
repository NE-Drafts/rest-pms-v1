// src/modules/reservation/reservation.validator.ts
import { z } from 'zod';

const createReservationBaseSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
});

const approveReservationBaseSchema = z.object({
  parkingSlotId: z.number().int().positive('Parking slot ID is required'),
});

export const createReservationSchema = z.object({
  body: createReservationBaseSchema
});

export const approveReservationSchema = z.object({
  body: approveReservationBaseSchema
});

export type CreateReservationInput = z.infer<typeof createReservationBaseSchema>;
export type ApproveReservationInput = z.infer<typeof approveReservationBaseSchema>;

