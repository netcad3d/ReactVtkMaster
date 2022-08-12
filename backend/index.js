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

const mainFolder = "uploads";
const folderName = "uploads";

app.get("/fetchFiles", (req, res) => {
  fs.readdir(mainFolder, (err, files) => {
    var obj = {};
    obj["name"] = "TestProje";
    var key = "children";
    obj[key] = [];

    var newObj = {};
    newObj["name"] = "";
    newObj["children"] = [];

    var fileNameobj = [];

    files.forEach((file) => {
      fileNameobj.push(file);
    });

    var lastFileType;
    var isFirst = true;

    for (var i = 0; i < fileNameobj.length; i++) {
      var str = fileNameobj[i].split("_");
      var fileType = str[0];

      if (isFirst) {
        if (fileType === "0") newObj["name"] = "Yüzeyler";
        else if (fileType === "1") newObj["name"] = "Bloklar";
        else if (fileType === "2") newObj["name"] = "Katı Modeller";

        if (fileNameobj.length === 1) obj[key].push(newObj);
      } else {
        if (lastFileType !== fileType) {
          obj[key].push(newObj);

          newObj = {};
          newObj["name"] = "";
          newObj["children"] = [];

          if (fileType === "0") newObj["name"] = "Yüzeyler";
          else if (fileType === "1") newObj["name"] = "Bloklar";
          else if (fileType === "2") newObj["name"] = "Katı Modeller";
        }
        if (i == fileNameobj.length - 1) obj[key].push(newObj);
      }

      var data = {
        id: i,
        name: fileNameobj[i],
        url: folderName + "/" + fileNameobj[i],
        children: [],
      };
      newObj[key].push(data);

      isFirst = false;
      lastFileType = fileType;
    }

    //obj[key].push(newObj);

    var main = [];
    main.push(obj);
    var jsonObj = JSON.stringify(main);
    res.send(jsonObj);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
