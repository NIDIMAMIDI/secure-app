import { verifyToken } from "../../helpers/jwt/jwt.helpers.js";
import {
  TokenNotProvidedError,
  InvalidTokenError,
  ExpiredTokenError,
  UserNotFoundError,
} from "../../middleware/errors/customErrors.js"; // Import custom errors
import { fetchUserById } from "../../helpers/User/User.helpers.js";
import User from "../../models/User/User.model.js";

// Authorization Middleware
export const authorization = async (req, res, next) => {
  try {
    let token;

    // Extract the token from headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token is provided
    if (!token) {
      return next(TokenNotProvidedError);
    }

    // Verify token
    let decoded;
    try {
      decoded = await verifyToken(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(ExpiredTokenError);
      }
      return next(InvalidTokenError);
    }

    // console.log(decoded);

    // Find user in DB
    // const user = await User.findById(decoded.id);
    const user = await fetchUserById(User, decoded.id);

    // If user does not exist, throw an error
    if (!user) {
      return next(UserNotFoundError);
    }

    // Assign user to request object
    req.user = user;

    next();
  } catch (error) {
    next(new AppError("Failed to authenticate token.", 500));
  }
};
