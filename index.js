const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs");
const pug = require("pug");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const hostname = "127.0.0.1";
const port = 3000;

//local database connectio url
const url = "mongodb://localhost:27017/TJS";

app.use(bodyParser.urlencoded({ extended: true }));

//pug connection view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (_, res) => {
  res.render("punchIn", {
    title: "PunchIn/Out-system",
  });
});

app.post("/punch", (req, res) => {
  //id of the user
  const formData = {
    id: req.body.id,
  };
  console.log(req.body);
  res.render("punchIn", {
    title: "PunchIn/Out-system",
  });
  mongoose.connect(url, function (_, db) {
    db.collection("punching").insertOne(formData, function (_, result) {
      console.log("id has been inserted");
      db.close;
    });
  });
});

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
