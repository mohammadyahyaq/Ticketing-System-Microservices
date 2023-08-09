import mongoose from "mongoose";

// to remove the warning
mongoose.set("strictQuery", true);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY is not defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("the database is connected successfully");
  } catch (error) {
    console.error(error);
  }
};

start();
