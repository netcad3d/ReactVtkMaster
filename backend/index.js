const express = require("express");

const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + " - " + file.originalname);
  },
});

const upload = multer({ storage }).array("file");

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).send(req.files);
  });
});

app.get("/fetchFiles", (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, "uploads"));

  const response = [];

  files.forEach((file) => {
    const extension = path.extname(file);
    const name = path.basename(file, extension);
    const size = fs.statSync(path.join(__dirname, "uploads", file)).size;
    const url = `http://localhost:3000/deleteFile/${file}`;

    response.push({
      name,
      extension,
      size,
      url,
    });
  }),
    res.send(response);
});

app.post("/deleteFile:name", (req, res) => {
  const file = req.body.name;
  const filePath = path.join(__dirname, "uploads", file);

  fs.unlinkSync(filePath);

  res.send("File deleted");
}),
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
