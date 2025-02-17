import Joi from "joi";
import validateSchema from "../../helpers/validation/validation.helper.js";
import AppError from "../../middleware/errors/AppError.js";

// Middleware function for validating user registration input
const loginValidation = async (req, res, next) => {
  try {
    // Define a Joi validation schema for user input
    const schema = Joi.object({
      // Email field: must be a valid email address and is required
      email: Joi.string().email().required(),

      // Password field: must be a string that matches the specified regex pattern and is required
      password: Joi.string().required(),

      role: Joi.string().valid("user", "admin").default("user").messages({
        "string.base": "Role should be a string",
        "any.only": "Role can only be user or admin",
      }),
    });

    // Validate the request body against the defined schema
    const { error } = validateSchema(schema, req.body);

    // If there are validation errors, send a response with status 400 (Bad Request)
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // Proceed to the next middleware if validation is successful
    next();
  } catch (err) {
    // Handle unexpected errors
    next(new AppError("An unexpected error occurred during validation.", 500));
  }
};

export default loginValidation;
