const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: String,
  extension: String,
  size: Number,
  url: String,
});

module.exports = mongoose.model("File", FileSchema);
