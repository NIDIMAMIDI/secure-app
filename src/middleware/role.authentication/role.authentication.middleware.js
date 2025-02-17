import AppError from "../errors/AppError.js";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      //   console.log("User attempting action:", req.user);

      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }

      next();
    } catch (error) {
      next(new AppError("Authorization error occurred", 500));
    }
  };
};
