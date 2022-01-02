const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Cartmodel", cartSchema,"cart");
