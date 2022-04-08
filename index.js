const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs");

const hostname = "127.0.0.1";
const port = 3000;

// Require static assets from public folder
app.use(express.static(path.join(__dirname, "public")));
// Set view engine as EJS
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
// Set 'views' directory for any views
// being rendered res.render()
// app.set("views", path.join(__dirname, ""));
app.set("views", path.join(__dirname, "views"));

// app.get("/form", express.static(__dirname + "/index.html"));

// let publicPath = path.join(__dirname, "public");

app.get("/student", (_, res) => {
  // res.sendFile(`${publicPath}/home.html`);
  const student = [
    {
      name: "teja",
      age: 23,
      contact: 7463882344,
    },
    { name: "teja", age: 23, contact: 7463882344 },
  ];
  // res.sendFile(path.join(__dirname, "views/index.html"));
  res.render("student", { student: student });
  // res.render("student", { student });
});

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
