const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();
let items = ["Buy Food", "Cook Food"];

app.use("/public", express.static(process.cwd() + "/public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("lists", { kindOfDay: day, newListItems: items });
});

app.post("/", function (req, res) {
    let item = req.body.newItem;

    items.push(item);

    res.redirect("/");
});

app.listen(port, function () {
    console.log("Server is started at http://localhost:" + port);
});
