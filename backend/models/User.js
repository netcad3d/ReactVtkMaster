const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  verified: {
	type: Boolean,
	default: false,
  },
  createdAt: { 
	type: Date,
	default: Date.now()}
});

const User = mongoose.model("User", UserSchema);

exports.User = User;
