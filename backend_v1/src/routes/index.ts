import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import vehicleRoutes from "../modules/vehicle/vehicle.routes";
// You will later import other routes like reservationRoutes, vehicleRoutes etc.

const router = Router();

router.use("/api/users", userRoutes);
router.use("/api/vehicles", vehicleRoutes);

export default router;
