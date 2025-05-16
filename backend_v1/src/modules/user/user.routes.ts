import { Router } from "express";
import * as userController from "./user.controller";
import { validate } from "../../middleware/validate.middleware";
import { registerSchema, loginSchema } from "./user.validator";

const router = Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

export default router;
