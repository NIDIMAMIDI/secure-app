import { Router } from "express";
import AuthRouter from "./auth/auth.router.js";
import UserProfileRouter from "./user.profile/user.profile.router.js";
const router = Router();

router.use("/auth", AuthRouter);
router.use("/user-profile", UserProfileRouter);

export default router;
