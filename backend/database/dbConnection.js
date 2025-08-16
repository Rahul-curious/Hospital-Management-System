import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "hospital_management",
    })
    .then(() => console.log("Connected to database!"))
    .catch((err) => console.error("DB connection error:", err));
};
