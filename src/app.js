import express from "express";
const app = express();
// import passport from "passport";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routes/authRoute.js";
import { AppError } from "./utils/appError.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import "./middlewares/authMiddleware.js"
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1", authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't access ${req.originalUrl} on this server`, 404));
});

app.use(errorMiddleware);

export default app;
