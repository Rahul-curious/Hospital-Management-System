import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 3 },
  lastName: { type: String, required: true, minLength: 3 },
  email: { type: String, required: true, validate: [validator.isEmail, "Invalid Email!"] },
  phone: { type: String, required: true, minLength: 11, maxLength: 11 },
  nic: { type: String, required: true, minLength: 13, maxLength: 13 },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  password: { type: String, required: true, minLength: 8, select: false },
  role: { type: String, required: true, enum: ["Patient", "Doctor", "Admin"] },
  doctorDepartment: { type: String },
  docAvatar: { public_id: String, url: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES });
};

export const User = mongoose.model("User", userSchema);
