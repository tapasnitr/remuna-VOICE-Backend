import { Router } from "express";
import { authController } from "./container.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch("/approve/:id", authController.approve);

export default router;