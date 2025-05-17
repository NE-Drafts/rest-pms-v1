-- This is an empty migration.

-- Convert primary keys to UUIDs across all tables
-- Replace existing auto-increment IDs with UUIDs

-- First, alter tables to add UUID columns
ALTER TABLE "User" ADD COLUMN "temp_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "Vehicle" ADD COLUMN "temp_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "ParkingSlot" ADD COLUMN "temp_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "Reservation" ADD COLUMN "temp_id" UUID DEFAULT gen_random_uuid();

-- Modify relationships to use UUID values
-- Modified vehicle userId reference
ALTER TABLE "Vehicle" ADD COLUMN "temp_userId" UUID;
UPDATE "Vehicle" SET "temp_userId" = "User"."temp_id" FROM "User" WHERE "Vehicle"."userId" = "User"."id";

-- Modified reservation foreign keys
ALTER TABLE "Reservation" ADD COLUMN "temp_userId" UUID;
ALTER TABLE "Reservation" ADD COLUMN "temp_vehicleId" UUID;
ALTER TABLE "Reservation" ADD COLUMN "temp_parkingSlotId" UUID NULL;

UPDATE "Reservation" SET 
  "temp_userId" = "User"."temp_id" 
FROM "User" 
WHERE "Reservation"."userId" = "User"."id";

UPDATE "Reservation" SET 
  "temp_vehicleId" = "Vehicle"."temp_id" 
FROM "Vehicle" 
WHERE "Reservation"."vehicleId" = "Vehicle"."id";

UPDATE "Reservation" SET 
  "temp_parkingSlotId" = "ParkingSlot"."temp_id" 
FROM "ParkingSlot" 
WHERE "Reservation"."parkingSlotId" = "ParkingSlot"."id";

-- Drop old constraints and foreign keys
ALTER TABLE "Vehicle" DROP CONSTRAINT IF EXISTS "Vehicle_userId_fkey";
ALTER TABLE "Reservation" DROP CONSTRAINT IF EXISTS "Reservation_userId_fkey";
ALTER TABLE "Reservation" DROP CONSTRAINT IF EXISTS "Reservation_vehicleId_fkey";
ALTER TABLE "Reservation" DROP CONSTRAINT IF EXISTS "Reservation_parkingSlotId_fkey";

-- Use temporary columns as new primary keys
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey";
ALTER TABLE "ParkingSlot" DROP CONSTRAINT "ParkingSlot_pkey";
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_pkey";

-- Drop old ID columns and rename temporary columns
ALTER TABLE "User" DROP COLUMN "id";
ALTER TABLE "User" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "User" ADD PRIMARY KEY ("id");

ALTER TABLE "Vehicle" DROP COLUMN "userId";
ALTER TABLE "Vehicle" RENAME COLUMN "temp_userId" TO "userId";
ALTER TABLE "Vehicle" DROP COLUMN "id";
ALTER TABLE "Vehicle" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "Vehicle" ADD PRIMARY KEY ("id");

ALTER TABLE "ParkingSlot" DROP COLUMN "id";
ALTER TABLE "ParkingSlot" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "ParkingSlot" ADD PRIMARY KEY ("id");

ALTER TABLE "Reservation" DROP COLUMN "userId";
ALTER TABLE "Reservation" RENAME COLUMN "temp_userId" TO "userId";
ALTER TABLE "Reservation" DROP COLUMN "vehicleId";
ALTER TABLE "Reservation" RENAME COLUMN "temp_vehicleId" TO "vehicleId";
ALTER TABLE "Reservation" DROP COLUMN "parkingSlotId";
ALTER TABLE "Reservation" RENAME COLUMN "temp_parkingSlotId" TO "parkingSlotId";
ALTER TABLE "Reservation" DROP COLUMN "id";
ALTER TABLE "Reservation" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "Reservation" ADD PRIMARY KEY ("id");

-- Re-add foreign key constraints
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
  
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
  
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_vehicleId_fkey" 
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE;
  
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_parkingSlotId_fkey" 
  FOREIGN KEY ("parkingSlotId") REFERENCES "ParkingSlot"("id") ON DELETE SET NULL;

-- Add resetToken field to User
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" TIMESTAMP;