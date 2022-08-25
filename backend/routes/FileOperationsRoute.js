const express = require("express");
const path = require("path");
const requireAuth = require("../middlewares/requireAuth");
const fs = require("fs");
const mongoose = require("mongoose");

//mail imports
const Token = require("../models/token");

//
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");

const File = require("../models/File");
const { User } = require("../models/User");
const router = express.Router();

router.use(methodOverride("_method"));

//! DB Connection
const mongoUri = process.env.MONGO_URI;
const connection = mongoose.createConnection(mongoUri);

//! GridFS Storage
let gfs;

connection.once("open", () => {
  //! Init stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

//! Create storage engine
const storage = new GridFsStorage({
  url: mongoUri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

//! @route POST /upload
//! @desc Uploads file to DB
router.post("/uploads", [upload.single("file"), requireAuth], (req, res) => {
  const userId = req.user._id;
  const reqFile = req.file;

  const file = new File({
    userId: userId,
    originalName: reqFile.originalname,
    fileName: reqFile.filename,
    size: reqFile.size,
    fileId: reqFile.id,
    uploadDate: reqFile.uploadDate,
    contentType: reqFile.contentType,
  });

  file.save().then((file) => {
    res.json(file);
  });
});

// //! Multer Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + " - " + file.originalname);
//   },
// });

// const upload = multer({ storage }).array("file");

// router.post("/uploads", [upload, requireAuth], (req, res) => {
//   const files = req.files;
//   const userId = req.user._id;

//   files.forEach((file) => {
//     //full name
//     const origName = file.filename;
//     const extension = path.extname(file.originalname);
//     const name = path.basename(file.originalname, extension);
//     const size = file.size;

//     const url = `http://localhost:3000/uploads/${file.filename}`;

//     const newFile = new File({
//       origName,
//       name,
//       extension,
//       size,
//       url,
//       userId,
//     });

//     newFile.save().then((file) => {
//       res.json(file);
//     });
//   });
// });

router.get("/fetchFiles", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const files = await File.find({ userId });

  res.json(files);
});

router.delete("/deleteFile/:id", requireAuth, async (req, res) => {
  const id = req.params.id;

  const file = await File.findById(id);

  if (file) {
    await File.findByIdAndDelete(id);

    //delete file locally
    const filePath = path.join(__dirname, "../uploads", file.origName);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log("File deleted");
    });

    const files = await File.find();
    res.json(files);
  } else {
    res.json({ message: "File not found" });
  }
});

router.delete("/deleteAllFiles", requireAuth, async (req, res) => {
  await File.deleteMany();

  fs.readdir(path.join(__dirname, "../uploads"), (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(__dirname, "../uploads", file), (err) => {
        if (err) throw err;
        console.log("File deleted");
      });
    });
  });

  res.json({ message: "All files deleted" });
});

router.get("/getFile/:id", async (req, res) => {
  const id = req.params.id;

  const file = await File.findById(id);

  if (file) {
    res.download(__dirname + "/../uploads/" + file.origName, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } else {
    res.json({ message: "File not found" });
  }
});

// verify email

router.get("/:id/verify/:token", async (req, res) => {
  try {
    console.log("heyy");
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid Link" });
    console.log(user);
    console.log(req.params.token);
    console.log(typeof req.params.token);
    //console.log(mongoose.Types.ObjectId(req.params.token));
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log("token findounu geçti");
    console.log(token);

    if (!token) return res.status(400).send({ message: "Invalid Link" });

    await User.updateOne({ _id: user._id }, { verified: true });

    console.log("updateyi geçti");
    console.log(user);
    console.log(user.verified);
    await token.remove();
    let usr = await User.findOne({ _id: req.params.id });

    res
      .status(200)
      .send({ message: "Account Verified", verified: usr.verified });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
