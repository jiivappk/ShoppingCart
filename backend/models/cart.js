const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  price: { type: Number },
  actualPrice: { type: Number },
  noOfStocks: { type: Number },
  discountPercentage: { type: Number },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deliveryPeriod: { type: Number }, 
  deliveryCharge: { type: Number },
  replacementPeriod: { type: Number },
  saveForLater: { type: Boolean}
});

module.exports = mongoose.model("Cartmodel", cartSchema,"cart");
