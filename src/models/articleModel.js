import mongoose from "mongoose";
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    unique: true,
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  state: {
    type: String,
    default: "draft",
    enum: ["draft", "published"],
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: String,
  },
  tags: {
    type: [String],
  },
  body: {
    type: String,
    unique: true,
    required: [true, "Blog body is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  owner: {
    type: String,
  },
});

const articleModel = mongoose.model("article", articleSchema);
export default articleModel;
