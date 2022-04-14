const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs");
const pug = require("pug");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

const hostname = "127.0.0.1";
const port = 3000;

dotenv.config({ path: "./config/config.env" });
connectDB();
app.use(bodyParser.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/api/punch", (_, res) => {
  res.render("punchIn", {
    title: "PunchIn/Out-system",
  });
});

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
