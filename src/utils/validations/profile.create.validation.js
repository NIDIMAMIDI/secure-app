import Joi from "joi";
import validateSchema from "../../helpers/validation/validation.helper.js";
import AppError from "../../middleware/errors/AppError.js";

// Middleware function for validating profile creation input
const profileValidation = async (req, res, next) => {
  try {
    // Define a Joi validation schema for profile input
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters",
        "string.max": "First name cannot exceed 50 characters",
      }),
      lastName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters",
        "string.max": "Last name cannot exceed 50 characters",
      }),
      phoneNumber: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.empty": "Phone number is required",
          "string.pattern.base": "Phone number must be exactly 10 digits",
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
    next(
      new AppError(
        "An unexpected error occurred during profile validation.",
        500
      )
    );
  }
};

export default profileValidation;
