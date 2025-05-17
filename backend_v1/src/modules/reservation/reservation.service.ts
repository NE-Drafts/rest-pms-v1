// // src/modules/reservation/reservation.service.ts
// import { PrismaClient } from '../../generated/prisma';
// import { sendApprovalEmail, sendRejectionEmail } from '../../utils/mailer';

// const prisma = new PrismaClient();

// export const createReservation = async (userId: string, date: string, vehicleId: string) => {
//   const existingReservation = await prisma.reservation.findFirst({
//     where: { userId, date, status: 'PENDING' },
//   });

//   if (existingReservation) {
//     throw new Error('You already have a pending reservation for this date.');
//   }

//   return await prisma.reservation.create({
//     data: {
//       userId,
//       date,
//       vehicleId,
//     },
//   });
// };

// export const getUserReservations = async (userId: string) => {
//   return await prisma.reservation.findMany({
//     where: { userId },
//     include: { parkingSlot: true, vehicle: true },
//     orderBy: { createdAt: 'desc' },
//   });
// };

// export const approveReservation = async (reservationId: string, adminId: string) => {
//   const reservation = await prisma.reservation.findUnique({
//     where: { id: reservationId },
//     include: { user: true },
//   });

//   if (!reservation || reservation.status !== 'PENDING') {
//     throw new Error('Invalid or already processed reservation.');
//   }

//   const availableSlot = await prisma.parkingSlot.findFirst({
//     where: {
//       isOccupied: false,
//       reservations: {
//         none: { date: reservation.date },
//       },
//     },
//   });

//   if (!availableSlot) {
//     throw new Error('No available parking slots for the selected date.');
//   }

//   const updatedReservation = await prisma.reservation.update({
//     where: { id: reservationId },
//     data: {
//       status: 'APPROVED',
//       approvedAt: new Date(),
//       parkingSlotId: availableSlot.id,
//       approvedBy: adminId,
//     },
//   });

//   await prisma.parkingSlot.update({
//     where: { id: availableSlot.id },
//     data: { isOccupied: true },
//   });

//   await sendApprovalEmail(reservation.user.email, reservation.date, availableSlot.name);

//   return updatedReservation;
// };

// export const rejectReservation = async (reservationId: string, adminId: string, reason?: string) => {
//   const reservation = await prisma.reservation.findUnique({
//     where: { id: reservationId },
//     include: { user: true },
//   });

//   if (!reservation || reservation.status !== 'PENDING') {
//     throw new Error('Invalid or already processed reservation.');
//   }

//   const updatedReservation = await prisma.reservation.update({
//     where: { id: reservationId },
//     data: {
//       status: 'REJECTED',
//       approvedBy: adminId,
//       rejectionReason: reason,
//     },
//   });

//   await sendRejectionEmail(reservation.user.email, reservation.date, reason);

//   return updatedReservation;
// };

import { PrismaClient, ReservationStatus } from '../../generated/prisma';
import { CreateReservationInput, ApproveReservationInput } from './reservation.validator';
import { sendApprovalEmail, sendRejectionEmail } from '../../utils/email.utils';

const prisma = new PrismaClient();

/**
 * Create a new reservation request
 */
export const createReservation = async (userId: string, data: CreateReservationInput) => {
  try {
    // Parse the date string to a Date object (YYYY-MM-DD)
    const reservationDate = new Date(data.date);
    reservationDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

    // Check if the user already has a reservation for this date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId,
        date: reservationDate,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.APPROVED] },
      },
    });

    if (existingReservation) {
      throw new Error('You already have a pending or approved reservation for this date');
    }

    // Check if the vehicle belongs to the user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: data.vehicleId,
        userId,
      },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found or does not belong to you');
    }

    // Create the reservation
    return await prisma.reservation.create({
      data: {
        userId,
        vehicleId: data.vehicleId,
        date: reservationDate,
        status: ReservationStatus.PENDING,
      },
      include: {
        vehicle: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all reservations for a user
 */
export const getUserReservations = async (userId: string) => {
  try {
    return await prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: true,
        parkingSlot: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all pending reservations (admin only)
 */
export const getPendingReservations = async () => {
  try {
    return await prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vehicle: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get a reservation by ID
 */
export const getReservationById = async (reservationId: string) => {
  try {
    return await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vehicle: true,
        parkingSlot: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Approve a reservation (admin only)
 */
export const approveReservation = async (
  reservationId: string,
  adminId: string,
  data: ApproveReservationInput
) => {
  try {
    // Check if the reservation exists and is pending
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new Error('Reservation is not in pending status');
    }

    // Check if the parking slot exists
    const parkingSlotFound = await prisma.parkingSlot.findUnique({
      where: {
        id: data.parkingSlotId,
      },
    });

    if (!parkingSlotFound) {
      throw new Error('Parking slot not found');
    }

    // Check if the parking slot is already assigned for this date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        date: reservation.date,
        parkingSlotId: data.parkingSlotId,
        status: ReservationStatus.APPROVED,
        id: { not: reservationId }, // Exclude current reservation
      },
    });

    if (existingReservation) {
      throw new Error('This parking slot is already assigned for this date');
    }

    // Approve the reservation
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: ReservationStatus.APPROVED,
        parkingSlotId: data.parkingSlotId,
        approvedAt: new Date(),
      },
      include: {
        user: true,
        parkingSlot: true,
      },
    });

    // Send approval email
    // Access user and parkingSlot through type assertion since we included them above
    const user = (updatedReservation as any).user;
    const slotInfo = (updatedReservation as any).parkingSlot;
    
    const formattedDate = updatedReservation.date.toISOString().split('T')[0];
    await sendApprovalEmail(
      user.email,
      formattedDate,
      slotInfo?.slotCode || 'N/A'
    );

    return updatedReservation;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a reservation (admin only)
 */
export const rejectReservation = async (reservationId: string) => {
  try {
    // Check if the reservation exists and is pending
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new Error('Reservation is not in pending status');
    }

    // Reject the reservation
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: ReservationStatus.REJECTED,
      },
      include: {
        user: true,
      },
    });

    // Send rejection email
    const user = (updatedReservation as any).user;
    const formattedDate = updatedReservation.date.toISOString().split('T')[0];
    await sendRejectionEmail(user.email, formattedDate);

    return updatedReservation;
  } catch (error) {
    throw error;
  }
};
