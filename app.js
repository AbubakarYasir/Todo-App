//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Setting up EJS and Express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose Connection
mongoose.connect(
  "mongodb+srv://admin-derek:" +
    `${process.env.MONGO_PASS}` +
    "@todo-app.4v2klwz.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Mongoose Schema (Main Page)
const itemsSchema = {
  name: String,
};

// Mongoose Model (Main Page)
const Item = mongoose.model("Item", itemsSchema);

// Mongoose Documents (Main Page)
const item1 = new Item({ name: "Welcome to your todolist!" });

const item2 = new Item({ name: "Hit the + butoon to add a new item." });

const item3 = new Item({ name: "<-- Hit this to delete an item." });

// Items Array (Main Page Default Items)
const defaulItems = [item1, item2, item3];

// Schema for Custom List
const listSchema = {
  name: String,
  items: [itemsSchema],
};
// Model for Custom List
const List = mongoose.model("List", listSchema);

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
// Responsible for Custom Route Parameters
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // Path to create a new List
        const list = new List({
          name: customListName,
          items: defaulItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show an Existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// Responsible for Adding New Items
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({ name: itemName });

  if (listName === "Today") {
    item.save(console.log("Succesfully Added to Today Page"));
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save(console.log("Sucessfully Added to " + foundList.name));
      res.redirect("/" + foundList.name);
    });
  }
});

// Responsible for Deleting Items
app.post("/delete", function (req, res) {
  // Checks Items for their ID
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully Deleted from Today's Page!");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          console.log("Succesfully Deleted from " + listName + "!");
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(3000, function () {
  console.log("Server started on port http://localhost:" + "3000");
});
