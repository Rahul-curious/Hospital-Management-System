import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

// Post Appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address } = req.body;

  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const doctor = await User.findOne({ firstName: doctor_firstName, lastName: doctor_lastName, role: "Doctor", doctorDepartment: department });
  if (!doctor) return next(new ErrorHandler("Doctor not found", 404));

  const appointment = await Appointment.create({
    firstName, lastName, email, phone, nic, dob, gender, appointment_date, department,
    doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
    hasVisited, address, doctorId: doctor._id, patientId: req.user._id
  });

  res.status(200).json({ success: true, appointment, message: "Appointment Sent!" });
});

// Get All Appointments
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({ success: true, appointments });
});

// Update Appointment Status
export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!appointment) return next(new ErrorHandler("Appointment not found!", 404));
  res.status(200).json({ success: true, message: "Appointment Status Updated!" });
});

// Delete Appointment
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment Not Found!", 404));
  await appointment.deleteOne();
  res.status(200).json({ success: true, message: "Appointment Deleted!" });
});
