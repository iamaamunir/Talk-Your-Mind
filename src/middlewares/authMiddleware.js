// Strategy to sign into the app and sign up
import passport from "passport";
import { ExtractJwt } from "passport-jwt";
import { JWTStrategy } from "passport-jwt";
import { localStrategy } from "passport-local";
import { dotenv } from "dotenv";
dotenv.config();
import userModel from "../models/userModel";

// Auth endpoints with JWTStrategy
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await userModel.findById(token._id);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user); // this will attach user to req.user
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// AUth email and password with passport-local

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        if (!email || !password || !firstname || !lastname) {
          return done(null, false, { message: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: "Email already registered" });
        }
        const user = await userModel.create({
          email,
          firstname,
          lastname,
          password,
        });
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  //   create strategy and configure state
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
          return done(null, false, { message: "Password is incorrect" });
        }
        const userDetails = {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }
        return done(null, userDetails, { message: "Login successfull" });
      } catch (err) {
        return done(err);
      }
    }
  )
);
