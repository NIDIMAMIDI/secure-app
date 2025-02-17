import {
  createProfile,
  deleteProfile,
  isProfileExists,
  updateProfile,
} from "../../helpers/User/User.helpers.js";
import AppError from "../../middleware/errors/AppError.js";
import { InternalServerError } from "../../middleware/errors/customErrors.js";
import Profile from "../../models/Profile/Profile.model.js";

export const createUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id || !req.user.email) {
      return next(new AppError("User authentication failed.", 401));
    }

    const userId = req.user.id;
    const email = req.user.email;

    // Check if a profile already exists for the user
    const existingProfile = await isProfileExists(Profile, userId);

    if (existingProfile) {
      return next(new AppError("Profile already exists for this user.", 400));
    }

    const newProfile = await createProfile(
      Profile,
      firstName,
      lastName,
      email,
      userId,
      phoneNumber
    );

    res.status(201).json({
      status: "success",
      message: "Profile created successfully",
      data: newProfile,
    });
  } catch (error) {
    next(InternalServerError);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("User authentication failed.", 401));
    }

    const userId = req.user.id;
    const profile = await isProfileExists(Profile, userId);

    if (!profile) {
      return next(new AppError("Profile not found.", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    return next(InternalServerError);
  }
};

// export const updateUserProfile = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return next(new AppError("User authentication failed.", 401));
//     }

//     const userId = req.user.id;
//     const { firstName, lastName, phoneNumber } = req.body;

//     // Find and update the profile using $set
//     const updatedProfile = await updateProfile(
//       Profile,
//       userId,
//       firstName,
//       lastName,
//       phoneNumber
//     );

//     if (!updatedProfile) {
//       return next(new AppError("Profile not found.", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Profile updated successfully",
//       data: updatedProfile,
//     });
//   } catch (error) {
//     next(InternalServerError);
//   }
// };

export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("User authentication failed.", 401));
    }

    const userId = req.user.id;
    const { firstName, lastName, phoneNumber } = req.body;

    // Check if the profile exists
    const existingProfile = await isProfileExists(Profile, userId);

    if (!existingProfile) {
      return next(new AppError("Profile not found.", 404));
    }

    // Ensure that the authenticated user is updating their own profile
    if (existingProfile.userId.toString() !== userId.toString()) {
      return next(new AppError("Unauthorized to update this profile.", 403));
    }

    // Update the profile using findByIdAndUpdate
    const updatedProfile = await updateProfile(
      Profile,
      existingProfile._id,
      firstName,
      lastName,
      phoneNumber
    );

    if (!updatedProfile) {
      return next(new AppError("Profile update failed.", 500));
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(new InternalServerError());
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("User authentication failed.", 401));
    }

    const userId = req.user.id;

    // Check if the profile exists
    const existingProfile = await isProfileExists(Profile, userId);
    if (!existingProfile) {
      return next(new AppError("Profile not found.", 404));
    }

    // Ensure the authenticated user is deleting their own profile
    if (existingProfile.userId.toString() !== userId.toString()) {
      return next(new AppError("Unauthorized to delete this profile.", 403));
    }

    // Attempt to delete the profile using findOneAndDelete
    const deletedProfile = await deleteProfile(Profile, existingProfile._id);

    res.status(200).json({
      status: "success",
      message: "Profile deleted successfully",
    });
  } catch (error) {
    next(new InternalServerError());
  }
};
