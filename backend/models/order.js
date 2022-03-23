const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: Object, required: true},
  orderStatus: { type: Array, required: true}
});

module.exports = mongoose.model("Ordermodel", orderSchema,"order");