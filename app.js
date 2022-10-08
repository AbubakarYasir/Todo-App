//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = requrie("mongoose");

const app = express();
// Setting up EJS and Express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose Connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schema
const itemsSchema = {
  name: String,
};

// Mongoose Model
const Item = mongoose.model("Item", itemsSchema);

// Mongoose Documents
const item1 = new item({ name: "Welcome to your todolist!" });

const item2 = new item({ name: "Hit the + butoon to add a new item." });

const item3 = new item({ name: "<-- Hit this to delete an item." });

// Items Array
const defaulItems = [item1, item2, item3];

// Insert Documents/Data Array in Database
Item.insertMany(defaulItems, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Data Inserted Sucessfully!");
  }
});

app.get("/", function (req, res) {
  res.render("list", { listTitle: "Today", newListItems: items });
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
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
