const mongoose = require("mongoose");

const productReviewSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productTitle: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  profilePic: { type: String},
  ratingScale: { type: String, required: true},
  comment: { type: String, required: true },
  images: {type: Array},
});
module.exports = mongoose.model("ProductReview", productReviewSchema);
