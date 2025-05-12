import jwt from "jsonwebtoken";
import passport from "passport";
import dotevn from "dotenv";
dotevn.config();

export const formattedData = (user) => {
  const email = user.email;
  const firstname = user.firstname;
  const lastname = user.lastname;
  return { email: email, firstname: firstname, lastname: lastname };
};

export const signTokens = (user) => {
  const payload = { _id: user._id };
  return jwt.sign({ user: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
