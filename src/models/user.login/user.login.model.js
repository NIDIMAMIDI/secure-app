import mongoose from "mongoose";
const registrationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RegisterHistory = mongoose.model(
  "RegisterHistory",
  registrationHistorySchema
);
