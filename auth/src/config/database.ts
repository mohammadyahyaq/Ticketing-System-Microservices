import mongoose from "mongoose";

// to remove the warning
mongoose.set("strictQuery", true);

const start = async () => {
  console.log("another change");
  
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY is not defined");
  }
  if (!process.env.MONGO_URI) {
    throw Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("the database is connected successfully");
  } catch (error) {
    console.error(error);
  }
};

start();
