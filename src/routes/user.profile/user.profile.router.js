import { Router } from "express";
import { authorization } from "../../middleware/auth/auth.middleware.js";
import profileValidation from "../../utils/validations/profile.create.validation.js";
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../../controllers/profile/profile.controllers.js";
const UserProfileRouter = Router();

// Authorization Middle
UserProfileRouter.use(authorization);

UserProfileRouter.post("/create", profileValidation, createUserProfile);
UserProfileRouter.get("/fetch", getUserProfile);
UserProfileRouter.put("/update", updateUserProfile);
UserProfileRouter.delete("/delete", deleteUserProfile);

export default UserProfileRouter;
