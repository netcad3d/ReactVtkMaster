const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const File = require("../models/File");

console.log(process.env.MONGO_URI);

//! Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + " - " + file.originalname);
  },
});

const upload = multer({ storage }).array("file");

router.post("/uploads", upload, (req, res) => {
  const files = req.files;

  files.forEach((file) => {
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    const size = file.size;

    const url = `http://localhost:3000/uploads/${file.filename}`;
    console.log(url);

    const newFile = new File({
      name,
      extension,
      size,
      url,
    });

    newFile.save().then((file) => {
      res.json(file);
    });
  });
});

router.get("/fetchFiles", async (req, res) => {
  const files = await File.find();
  res.json(files);
});

router.delete("/deleteFile/:id", async (req, res) => {
  const id = req.params.id.substring(1);

  const file = await File.findById(id);

  if (file) {
    await File.findByIdAndDelete(id);
    res.json({ message: "File deleted" });
  } else {
    res.json({ message: "File not found" });
  }
});

router.get("/getFile/:id", async (req, res) => {
  const id = req.params.id.substring(1);

  const file = await File.findById(id);

  if (file) {
    res.download(__dirname + "/../uploads/" + file.filename, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } else {
    res.json({ message: "File not found" });
  }
});

module.exports = router;
