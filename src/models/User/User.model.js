import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
