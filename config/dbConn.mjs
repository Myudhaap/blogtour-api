import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOODB_URI);
  } catch (err) {
    console.log(`${err} cannot connect!`);
  }
};
