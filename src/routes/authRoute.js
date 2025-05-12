import express from "express";
const authRouter = express.Router();
import passport from "passport";
import validateUserMiddelWare from "../validators/user.validator.js";
import * as authController from "../controllers/authController.js";

authRouter.post(
  "/signup",
  validateUserMiddelWare,
  passport.authenticate("signup", { session: false }),
  authController.signup
);

authRouter.post(
  "/login",
  validateUserMiddelWare,
  passport.authenticate("login", { session: false }),
  authController.login
);

export default authRouter;
