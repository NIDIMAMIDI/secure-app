import { forgotPasswordMailSend } from "../../helpers/email/email.helpers.js";
import { createToken } from "../../helpers/jwt/jwt.helpers.js";
import {
  hashPassword,
  passwordChecking,
} from "../../helpers/password.encrypt/password.encrypt.js";
import { randomPasswordGenerator } from "../../helpers/password.generator/passsword.generator.helpers.js";
import {
  fetchUserByEmail,
  fetchUserByEmailAndRole,
  fetchUserById,
  registeredUsers,
  storeUserToken,
  userCreate,
  userRegisteredHistory,
} from "../../helpers/User/User.helpers.js";
import AppError from "../../middleware/errors/AppError.js";
import {
  InternalServerError,
  PasswordNotMatchError,
} from "../../middleware/errors/customErrors.js";
import { RegisterHistory } from "../../models/user.login/user.login.model.js";
import User from "../../models/User/User.model.js";

export const userRegistration = async (req, res, next) => {
  try {
    // Fetching validated data from the authValidator file
    const { email, password, role } = req.body;

    const userRole = role || "user";

    // Convert the email to lowercase for consistency
    const loweredEmail = email.toLowerCase();

    // Check if the email already exists in the database
    const existingUser = await fetchUserByEmailAndRole(
      User,
      loweredEmail,
      userRole
    );
    if (existingUser) {
      return next(
        new AppError(`User with email ${loweredEmail} already exists`, 400)
      );
    }

    // Hash the password with bcrypt (use 12 salt rounds)
    const hashedPassword = await hashPassword(password, 12);

    // Create a new user in the database
    const newUser = await userCreate(
      User,
      loweredEmail,
      hashedPassword,
      userRole
    );

    // Create a JWT token and get cookie options
    const { token, cookieOptions } = createToken(newUser);

    // Store the generated token in the User model
    await storeUserToken(User, newUser._id, token);

    // Fetch the user with token
    const user = await fetchUserById(User, newUser._id);

    // Set the token as a cookie in the response
    res.cookie("jwt", token, cookieOptions);

    // storing user id and email of the registered users
    await userRegisteredHistory(RegisterHistory, user._id, user.email);

    // Send a success response with the newly created user and token
    res.status(201).json({
      status: "success",
      message: `${user.email}'s registration successful`,
      userDetails: {
        user,
      },
    });
  } catch (error) {
    next(InternalServerError);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    // fetching validated data from the authValidator
    const { email, password, role } = req.body;
    const userRole = role || "user";

    // converting email to a lowerCase
    const loweredEmail = email.toLowerCase();

    // check if user email exists in database
    const user = await fetchUserByEmailAndRole(User, loweredEmail, userRole);

    // if user does not found with the provided mail it will give error response
    if (!user) {
      return next(new AppError(`User with ${email} doesn't exists`, 404));
    }

    // check if password is correct or not
    const isPAsswordCorrect = await passwordChecking(password, user.password);

    // if provided password does not match stored password it will throw the error response
    if (!isPAsswordCorrect) {
      return next(PasswordNotMatchError);
    }

    // fetching jwt token and cookie options
    const { token, cookieOptions } = createToken(user);

    // Store the generated token in the User model
    await storeUserToken(User, user._id, token);

    // Fetch the user with token
    const userDetails = await fetchUserById(User, user._id);

    // setting token as a cookie
    res.cookie("jwt", token, cookieOptions);

    const { password: pwd, createdAt, updatedAt, ...other } = userDetails._doc;

    // success response
    res.status(200).json({
      status: "success",
      message: `User ${userDetails.email}'s Login Successful`,
      userDetails: {
        ...other,
      },
    });
  } catch (err) {
    // error response
    next(InternalServerError);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    // Get user ID from the request object (assuming it's set in auth middleware)
    const userId = req.user._id;

    // Fetch user from the database
    const user = await fetchUserById(User, userId);

    // If user not found, return an error response
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Remove the token from the database by setting it to null
    await storeUserToken(User, userId, null);

    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    // Send success response
    res.status(200).json({
      status: "success",
      message: "User logged out successfully.",
    });
  } catch (error) {
    next(InternalServerError);
  }
};

export const forgotPassWord = async (req, res, next) => {
  try {
    // fetching the mail from request body
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide the mail", 500));
    }

    // converting mail to lowercase
    const loweredCaseEmail = email.toLowerCase();

    // check if user exists or not
    const user = await fetchUserByEmail(User, loweredCaseEmail);

    // if user is not there give error response
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Generating a random password
    const randomPassword = await randomPasswordGenerator();

    // Hashing the random password
    const hashedPassword = await hashPassword(randomPassword, 12);

    // stroing the hashed random generated password into the user collection database
    user.password = hashedPassword;
    user.save();

    // send the generated password mail to user
    forgotPasswordMailSend(loweredCaseEmail, randomPassword);

    // Success Response
    res.status(200).json({
      status: "success",
      data: {
        message:
          "Generated Password has been sent to the registered email Successfully",
      },
    });
  } catch (err) {
    // Error Response
    next(InternalServerError);
  }
};

export const fetchRegisteredUsers = async (req, res, next) => {
  try {
    const users = await registeredUsers(RegisterHistory);
    const usersData = [];
    users.forEach((user) => {
      const { __v, createdAt, updatedAt, ...other } = user._doc;
      usersData.push(other);
    });

    res.status(200).json({
      status: "success",
      message:
        usersData.length === 0
          ? "No Users are registered yet"
          : `${usersData.length} members are registered.`,
      users: usersData.length > 0 ? usersData : [],
    });
  } catch (error) {
    // Error Response
    next(InternalServerError);
  }
};
