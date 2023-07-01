const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  actualPrice: { type: Number, required: true },
  noOfStocks: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  deliveryAddress: { type: Object, required: true },
  additionalImages: { type: Array, required: true },
  orderInfo: { type: Array, required: true },
  orderStatus: { type: String, required: true},
  refundStatus: {type: String,  required: true }
});

module.exports = mongoose.model("Ordermodel", orderSchema,"order");