import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  firstname: {
    type: String,
    required: [true, "first name is required"],
  },
  lastname: {
    type: String,
    required: [true, "last name is required"],
  },
  article: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articles",
    },
  ],
  isActive: {
    type: String,
    enum: ['active', "inactive"],
    default: "active"
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    //   returnedObject.id = returnedObject._id.toString()
    //   delete returnedObject._id
    delete returnedObject.__v;
  },
});
const userModel = mongoose.model("user", userSchema);
export default userModel;
