import { z } from 'zod';

const parkingSlotBaseSchema = z.object({
  slotCode: z.string().min(1, 'Slot code is required'),
});

const availableSlotsBaseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
});

export const parkingSlotSchema = z.object({
  body: parkingSlotBaseSchema
});

export const availableSlotsSchema = z.object({
  query: availableSlotsBaseSchema
});

export type ParkingSlotInput = z.infer<typeof parkingSlotBaseSchema>;
export type AvailableSlotsInput = z.infer<typeof availableSlotsBaseSchema>;
