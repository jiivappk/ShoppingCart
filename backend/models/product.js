const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  additionalImages: {type: Array},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number },
  actualPrice: { type: Number },
  noOfStocks: { type: Number },
  discountPercentage: { type: Number },
  deliveryPeriod: { type: Number},
  deliveryCharge: { type: Number},
  replacementPeriod: { type: Number}
});

module.exports = mongoose.model("Product", productSchema);
