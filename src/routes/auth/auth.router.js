import { Router } from "express";
import registerValidation from "../../utils/validations/user.register.validation.js";
import {
  fetchRegisteredUsers,
  forgotPassWord,
  userLogin,
  userLogout,
  userRegistration,
} from "../../controllers/auth/auth.controllers.js";
import loginValidation from "../../utils/validations/user.login.validation.js";
import { authorization } from "../../middleware/auth/auth.middleware.js";
import { restrictTo } from "../../middleware/role.authentication/role.authentication.middleware.js";

const AuthRouter = Router();

// Basic Authentication functionalities

AuthRouter.post("/register", registerValidation, userRegistration);
AuthRouter.post("/login", loginValidation, userLogin);
AuthRouter.post("/forgot-password", forgotPassWord);

// Fetching the api based of authorization

AuthRouter.post("/logout", authorization, userLogout);

// Role Based Authentication

AuthRouter.post(
  "/users",
  authorization,
  restrictTo("admin"),
  fetchRegisteredUsers
);

export default AuthRouter;
