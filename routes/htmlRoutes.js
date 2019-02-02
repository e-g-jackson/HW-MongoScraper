var path = require("path");
// var db = require(path.join(__dirname, "../models/model.js"));

module.exports = function(app){
    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "../public/html/index.html"));
    })
}
