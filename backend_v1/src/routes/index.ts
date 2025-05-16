import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
// You will later import other routes like reservationRoutes, vehicleRoutes etc.

const router = Router();

router.use("/api/users", userRoutes);

export default router;
