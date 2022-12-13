const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "user" },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
