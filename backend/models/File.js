const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true,
  },
  originalName: String,
  fileName: String,
  size: Number,
  fileId: mongoose.Schema.Types.ObjectId,
  uploadDate: Date,
  contentType: String,
});

module.exports = mongoose.model("File", FileSchema);
