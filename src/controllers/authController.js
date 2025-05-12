import passport from "passport";
import { signTokens, formattedData } from "../services/authService.js";

export const signup = async (req, res, next) => {
  try {
    const userData = formattedData(req.user);
    res.status(201).send({ user: userData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = await signTokens(user);
        return res.status(200).json({ token });
      });

      next();
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};
