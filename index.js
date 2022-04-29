const express = require("express");
const path = require("path");
const app = express();
const pug = require("pug");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const mongoose = require("mongoose");
const { WebClient } = require("@slack/web-api");
const useragent = require("express-useragent");
const axios = require("axios").default;
const dotenv = require("dotenv");
const hostname = "127.0.0.1";
const port = 3000;

dotenv.config();

//local database connection url
const url = "mongodb://localhost:27017/TJS";

app.use(bodyParser.urlencoded({ extended: true }));

//pug connection view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(useragent.express());
app.use("/public", express.static(path.join(__dirname, "public")));

//punch in landing page method:
app.get("/", (_, res) => {
  return res.render("punchIn", {
    title: "PunchIn/Out-system",
  });
});
//List of employess :
const employees = {
  "000": "Priyank",
  "001": "Chetna",
  "002": "Vinay",
  "003": "Sridhar",
  "004": "Nikunj",
  "005": "Jayanth",
  "006": "Avantika",
  "007": "Harsh",
  "008": "Omprakash",
  "009": "Thejasri",
};

//punch in submit method:
app.post("/", async (req, res) => {
  //if data is empty it will not store the data into db instead it will redirect to the home page
  if (req.body.id === "") return res.redirect("/");
  //current time :
  let current_time_obj = new Date().toLocaleTimeString();
  //Form Data:
  const formData = {
    id: req.body.id,
    [new Date().toLocaleDateString()]: {
      current_date_obj: [{ "Punch In": current_time_obj }],
    },
  };
  let latestEntry = undefined;
  //location of the employee:
  const api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.lat},${req.body.long}&key=${process.env.GOOGLE_API_KEY}`;
  let results;
  const getAddressByReverseCoding = async () => {
    try {
      const response = await axios.get(api);
      results = JSON.stringify(response.data.results[0].formatted_address);
    } catch (error) {
      console.error(error.response.data);
      return res.redirect("/?e=error");
    }
  };
  await getAddressByReverseCoding();
  //IP Address :
  const clientIp = requestIp.getClientIp(req);
  //userAgent :
  const userAgentMobileOrDesktop =
    req.useragent.isMobile === true ? "Mobile" : "Desktop";
  const userAgent =
    req.useragent.os +
    "," +
    req.useragent.platform +
    "," +
    req.useragent.browser +
    "," +
    userAgentMobileOrDesktop +
    "," +
    req.useragent.source;

  //Database connection:
  mongoose.connect(url, async (_, db) => {
    const databaseConnection = db.collection("punching");
    const findResult = await databaseConnection.findOne({ id: req.body.id });
    //find results :
    if (findResult) {
      //Update data for existed Id for only current date:
      if (findResult[new Date().toLocaleDateString()]) {
        latestEntry = Object.keys(
          findResult[new Date().toLocaleDateString()]["current_date_obj"][
            findResult[new Date().toLocaleDateString()]["current_date_obj"]
              .length - 1
          ]
        )[0];
        databaseConnection.updateOne(
          { _id: findResult._id },
          {
            $push: {
              [`${new Date().toLocaleDateString()}.current_date_obj`]: {
                [latestEntry === "Punch In" ? "Punch Out" : "Punch In"]:
                  current_time_obj,
              },
            },
          }
        );
      } else {
        //undates data nestedly for previously stored data:
        databaseConnection.updateOne(
          { _id: findResult._id },
          {
            $push: {
              [`${new Date().toLocaleDateString()}.current_date_obj`]: {
                [latestEntry === "Punch In" ? "Punch Out" : "Punch In"]:
                  current_time_obj,
              },
            },
          }
        );
      }
    } else {
      // insert the data id is as new entry:
      databaseConnection.insertOne(formData, () => {
        db.close;
      });
    }

    // An access token (from your Slack app or custom integration - xoxp, xoxb)
    const token = process.env.SLACK_API_KEY;

    const web = new WebClient(token);

    // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
    const conversationId = process.env.CONVERSATION_ID;

    await web.chat.postMessage({
      channel: conversationId,
      text: `User : ${employees[req.body.id] || "Unknown"} \n ${
        latestEntry === "Punch In" ? "Punch Out" : "Punch In"
      } : ${current_time_obj} \n Location: ${results},${req.body.lat},${
        req.body.long
      }\n IP Address: ${clientIp} \n User Agent: ${userAgent}`,
    });

    //after executing the all the process it will redirect it home page :
    return res.redirect("/?e=success");
  });
});

//server is running at this port:
app.listen(port, hostname, () => {
  return console.log(`server is running at http://${hostname}:${port}`);
});
