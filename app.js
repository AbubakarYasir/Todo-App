//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
const item1 = new Item({ name: "Welcome to your todolist!" });

const item2 = new Item({ name: "Hit the + butoon to add a new item." });

const item3 = new Item({ name: "<-- Hit this to delete an item." });

// Items Array
const defaulItems = [item1, item2, item3];

app.get("/", function (req, res) {
  // Mongoose Find Method
  Item.find({}, function (err, foundItems) {
    // Insert Default Documents/Data Array in Database if not found
    if (foundItems.length === 0) {
      Item.insertMany(defaulItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Data Inserted Sucessfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});
// Responsible for Adding New Items
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({ name: itemName });

  item.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully Added");
    }
  });

  res.redirect("/");
});

// Responsible for Deleting Items
app.post("/delete", function (req, res) {
  // Checks Items for their ID
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully Deleted!");
    }
  });
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port http://localhost:" + "3000");
});
