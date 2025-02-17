import Joi from "joi";
import validateSchema from "../../helpers/validation/validation.helper.js";
import AppError from "../../middleware/errors/AppError.js";

// Middleware function for validating user registration input
const registerValidation = async (req, res, next) => {
  try {
    // Define a Joi validation schema for user input
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required.",
      }),

      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%])[A-Za-z\d@#%]{8,50}$/
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, %).",
          "any.required": "Password is required.",
        }),

      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match.",
          "any.required": "Confirm Password is required.",
        }),
      role: Joi.string().valid("user", "admin").default("user").messages({
        "string.base": "Role should be a string",
        "any.only": "Role can only be user or admin",
      }),
    });

    // Validate request data
    const { error } = validateSchema(schema, req.body);

    // If there are validation errors, send a proper response
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    // Proceed to the next middleware if validation passes
    next();
  } catch (err) {
    next(new AppError("An unexpected error occurred during validation.", 500));
  }
};

export default registerValidation;
