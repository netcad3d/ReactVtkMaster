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
  let id = 0;

  files.forEach((file) => {
    const extension = path.extname(file);
    const name = path.basename(file, extension);
    const size = fs.statSync(path.join(__dirname, "uploads", file)).size;
    const url = `http://localhost:3000/uploads/${file}`;
    const idG = id++;

    response.push({
      name,
      extension,
      size,
      url,
      idG,
    });
  }),
    res.send(response);
});

app.delete("/deleteFile/:name", (req, res) => {
  const name = req.params.name;
  const files = fs.readdirSync(path.join(__dirname, "uploads"));
  const response = [];
  let id = 0;

  files.forEach((file) => {
    const extension = path.extname(file);
    const nameFile = path.basename(file, extension);
    const size = fs.statSync(path.join(__dirname, "uploads", file)).size;
    const url = `http://localhost:3000/uploads/${file}`;
    const idG = id++;

    if (nameFile === name) {
      fs.unlinkSync(path.join(__dirname, "uploads", file));
    }

    response.push({
      name: nameFile,
      extension,
      size,
      url,
      idG,
    });
  }),
    res.send(response);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
