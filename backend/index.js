require("./models/File");

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const FileOperationsRoute = require("./routes/FileOperationsRoute");
const AuthOperationsRoute = require("./routes/AuthOperationsRoute");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(FileOperationsRoute);
// app.use(AuthOperationsRoute);

//! DB Connection
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
