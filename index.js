const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();
let items = ["Buy Food", "Cook Food"];
let workItems = ["Design Post", "Design Slider"];

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

    res.render("lists", { listTitle: day, newListItems: items });
});
app.post("/", function (req, res) {
    let item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);

        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
    res.render("lists", { listTitle: "Work List", newListItems: workItems });
});
// app.post("/work", function (req, res) {
//     let item = req.body.newItem;
//     workItems.push(workItems);
//     res.redirect("/work");
// });

app.listen(port, function () {
    console.log("Server is started at http://localhost:" + port);
});
