const express = require("express");
const path = require("path");
const app = express();
const pug = require("pug");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hostname = "127.0.0.1";
const port = 3000;

//local database connection url
const url = "mongodb://localhost:27017/TJS";

const employees = {
  "000": "Priyank",
  "001": "jayanth",
};

app.use(bodyParser.urlencoded({ extended: true }));

//pug connection view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//punch in landing page method:
app.get("/", (_, res) => {
  return res.render("punchIn", {
    title: "PunchIn/Out-system",
  });
});

//punch in submit method:
app.post("/punch", async (req, res) => {
  if (req.body.id !== "") return res.redirect("/");
  let current_time_obj = new Date().toLocaleTimeString();
  //Form Data:
  const formData = {
    id: req.body.id,
    [new Date().toLocaleDateString()]: {
      current_date_obj: [{ punchIn: current_time_obj }],
    },
  };

  //Database connection:
  mongoose.connect(url, async (_, db) => {
    const databaseConnection = db.collection("punching");
    const findResult = await databaseConnection.findOne({ id: req.body.id });

    if (findResult) {
      // update the data if id already :
      //will get the latest-punchIn or punchOut:
      const latestEntry = Object.keys(
        findResult[new Date().toLocaleDateString()]["current_date_obj"][
          findResult[new Date().toLocaleDateString()]["current_date_obj"]
            .length - 1
        ]
      )[0];

      const latestStamp = latestEntry;

      databaseConnection.updateOne(
        { _id: findResult._id },
        {
          $push: {
            [`${new Date().toLocaleDateString()}.current_date_obj`]: {
              [latestStamp === "punchIn" ? "punchOut" : "punchIn"]:
                current_time_obj,
            },
          },
        }
      );
    } else {
      // insert the data id is as new entry:
      databaseConnection.insertOne(formData, () => {
        db.close;
      });
    }
    res.redirect("/");
  });
});
//server is running at this port:
app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
