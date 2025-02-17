import AppError from "./AppError.js";

export const AuthenticationFailedError = new AppError(
  "Authentication failed",
  401
);
export const UnauthorizedError = new AppError("Unauthorized access", 403);
export const ValidationError = new AppError("Invalid input data", 400);
export const ResourceNotFoundError = new AppError(
  "Requested resource not found",
  404
);
export const InternalServerError = new AppError("Internal server error", 500);
export const PasswordNotMatchError = new AppError(
  "Invalid password provided",
  401
);

export const TokenNotProvidedError = new AppError(
  "You are not logged in or Bearer Token is missing.",
  400
);

export const InvalidTokenError = new AppError(
  "Invalid token. Please log in again.",
  401
);

export const ExpiredTokenError = new AppError(
  "Token expired! Please log in again to get access.",
  401
);

export const UserNotFoundError = new AppError(
  "The user associated with this token no longer exists.",
  404
);
