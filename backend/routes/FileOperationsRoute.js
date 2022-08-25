const express = require("express");
const path = require("path");
const requireAuth = require("../middlewares/requireAuth");
const fs = require("fs");
const mongoose = require("mongoose");

//mail imports
const Token = require("../models/token");

//
const multer = require("multer");
const upload = require("../middlewares/upload");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

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
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads",
  });
});

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
//! @route GET /fetchFiles
//! @desc Fetch all user files from DB
router.get("/fetchFiles", requireAuth, async (req, res) => {
  const userId = req.user._id;
  const files = await File.find({ userId });

  res.json(files);
});

//! @route GET /fetchFile/:id
//! @desc Fetch a file from DB
router.get("/getFile/:id", async (req, res) => {
  const id = req.params.id;

  if (!id || id === "undefined") return res.status(400).send("no image id");

  const _id = new mongoose.Types.ObjectId(id);

  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send("no files exist");
    gfs.openDownloadStream(_id).pipe(res);
  });
});

//! @route DELETE /deleteFile/:id
//! @desc Delete a file from DB
router.delete("/deleteFile/:filename", requireAuth, async (req, res) => {
  const filename = req.params.filename;

  try {
    await gfs.files.deleteOne({ filename });
    res.send("File Deleted");
  } catch (err) {
    console.log(err);
    res.send(err);
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
