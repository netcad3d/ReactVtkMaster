const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const requireAuth = require("../middlewares/requireAuth");

//mail imports
const {Token}=require("../models/token");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
//

const File = require("../models/File");
const { TokenExpiredError } = require("jsonwebtoken");
const { User } = require("../models/User");
const router = express.Router();


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

router.post("/uploads", [upload, requireAuth], (req, res) => {
  const files = req.files;

  files.forEach((file) => {
    //full name
    const origName = file.filename;
    const extension = path.extname(file.originalname);
    const name = path.basename(file.originalname, extension);
    const size = file.size;

    const url = `http://localhost:3000/uploads/${file.filename}`;

    const newFile = new File({
      origName,
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

router.get("/fetchFiles", requireAuth, async (req, res) => {
  const files = await File.find();
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

router.get("/getFile/:id", requireAuth, async (req, res) => {
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

router.get("/:id/verify/:token", async (req, res) => {
	try{
		const user= await User.findOne({_id:req.params.id});
		if(!user) return res.status(400).send({message:"Invalid Link"});

		const token= await Token.findOne({
			userId:user._id,
			_id:req.params.token});

		if(!token) return res.status(400).send({message:"Invalid Link"});

		await User.updateOne({_id:user._id},{verified:true});
		await token.remove();

		res.status(200).send({message:"Account Verified"})

	}
	catch(err){
		
		console.log(err);
		res.status(500).send({message:"Internal Server Error"});
	}

})

module.exports = router;
