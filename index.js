const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const port = 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || port, function () {
    console.log("Server is started at http://localhost:" + port);
});
