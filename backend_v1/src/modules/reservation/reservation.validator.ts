// src/modules/reservation/reservation.validator.ts
import { z } from 'zod';

const createReservationBaseSchema = z.object({
  vehicleId: z.string().uuid('Vehicle ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
});

const approveReservationBaseSchema = z.object({
  parkingSlotId: z.string().uuid('Parking slot ID must be a valid UUID'),
});

export const createReservationSchema = z.object({
  body: createReservationBaseSchema
});

export const approveReservationSchema = z.object({
  body: approveReservationBaseSchema
});

export type CreateReservationInput = z.infer<typeof createReservationBaseSchema>;
export type ApproveReservationInput = z.infer<typeof approveReservationBaseSchema>;

