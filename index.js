import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import { connectDb } from "./config/dbConn.mjs";
import userRouter from "./routes/userRoutes.mjs";
import tourRouter from "./routes/tourRoutes.mjs";

const port = process.env.PORT || 5000;
const app = express();

connectDb();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRouter);
app.use("/tour", tourRouter);
app.get("/", (req, res) => {
  res.send("Welcome to Blog Tour API");
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongooDB");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
