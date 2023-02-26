const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringify } = require("querystring");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: { type: String},
  oldEmailToken: {type: String},
  newEmailToken: {type: String},
  firstName: { type: String},
  lastName: { type: String},
  address: { type: Array},
  phoneNumber: {type: String},
  profilePic: { type: String},
  gender: { type: String},
  dob: {type: String},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
