const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
require("dotenv").config();

const port = process.env.PORT || 80;

const app = express();
const items = ["Buy Food", "Cook Food"];
const workItems = ["Design Post", "Design Slider"];

app.use("/public", express.static(process.cwd() + "/public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    const day = date.getDate();

    res.render("lists", { listTitle: day, newListItems: items });
});
app.post("/", function (req, res) {
    const item = req.body.newItem;
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
app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(port, function () {
    console.log("Server is started at http://localhost:" + port);
});
