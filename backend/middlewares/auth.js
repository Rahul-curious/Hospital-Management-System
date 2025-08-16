import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

// Admin authentication
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return next(new ErrorHandler("Dashboard User not authenticated!", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (req.user.role !== "Admin")
    return next(new ErrorHandler(`${req.user.role} not authorized!`, 403));

  next();
});

// Patient authentication
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.patientToken;
  if (!token) return next(new ErrorHandler("User not authenticated!", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  if (req.user.role !== "Patient")
    return next(new ErrorHandler(`${req.user.role} not authorized!`, 403));

  next();
});

// Role authorization
export const isAuthorized = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new ErrorHandler(`${req.user.role} not allowed!`, 403));
  next();
};
