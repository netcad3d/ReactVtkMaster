const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
	index:true
  },
  origName: String,
  name: String,
  extension: String,
  size: Number,
  url: String,

});

module.exports = mongoose.model("File", FileSchema);
