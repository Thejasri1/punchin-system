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
const current_date_obj = new Date().toLocaleDateString();
console.log(current_date_obj);
let current_time_obj = new Date().toLocaleTimeString();
console.log(current_time_obj);
app.post("/punch", (req, res) => {
  //id of the user
  const formData = {
    id: req.body.id,
    [new Date().toLocaleDateString()]: {
      value: new Date(),
      current_date_obj: [
        { punchIn: current_time_obj },
        { PunchOut: current_time_obj },
      ],
    },
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
  // mongoose.connect(url, function (_, db) {
  //   try {
  //     let id = req.body.id;
  //     console.log(id);
  //     db.collection("punching").createIndex({ id: 1, current_date_obj: 1 });
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   db.collection("punching").insertOne(formData, function (_, result) {
  //     console.log("id has been inserted");
  //     db.close;
  //   });
  // });
});

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
