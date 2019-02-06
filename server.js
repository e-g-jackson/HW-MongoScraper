var express = require("express");
var app = express();
var path = require("path")
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
// var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/news_stories", { useNewUrlParser: true });

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// db.User.create()

// Routes
require("./routes/dataRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function(){
    console.log("App listening on port " + PORT)
})