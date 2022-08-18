require("./models/File");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const FileOperationsRoute = require("./routes/FileOperationsRoute");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(FileOperationsRoute);

//! DB Connection
const mongoUri =
  "mongodb+srv://netcadVtk:xAalt8VWrasDmgLI@netcadvtk.j1mtvyr.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", () => {
  console.error("Error connecting to mongo", err);
});

//! Routes

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
