var path = require("path");
var cheerio = require("cheerio");
var db = require(path.join(__dirname, "../models/index.js"));
var axios = require("axios");

module.exports = function(app){
    app.get("/scrape", function(req, res){
        console.log("starting scrape!");
        var results = [];
        var urlBase = "http://www.nytimes.com";
        axios.get("http://www.nytimes.com/section/opinion").then(function(response){
            console.log("inside axios function...")
            var $ = cheerio.load(response.data);
            $("article").each(function(i, element){
                var title = $(element).find("h2").text();
                var img = $(element).find("img").attr("src");
                var link = $(element).find("a").attr("href");
                var url = urlBase + link;
                var summary = $(element).find("p").text();
                
                // var dbInfo = db.scrapedData.aggregate([{$group:{_id: "$title", result: {$sum: 1}}}]);
                // console.log("////////////////////////////////////////////////////////////////////")
                // console.log(dbInfo);
                // console.log("////////////////////////////////////////////////////////////////////")
                
                results.push({
                    "title": title,
                    "img": img,
                    "link": url,
                    "summary": summary
                });
            });

            //results => database
            
            db.scrapedData.create(results)
             .then(function(dbArticle){
                console.log(dbArticle);
             })
             .catch(function(err){
                 if (err){
                    console.log("ohhh nooo!")
                    // console.log(err);
                    throw err;
                 }
             });
            console.log(results);
            res.send(results);
            
        });
    });
    app.get("/data/getAll", function(req, res){
        db.scrapedData.find({}, function(err, result){
            if(err){
                console.log(err);
            } else {
                console.log(result);
                res.json(result);
            }
        })
    })
    app.get("/data/getNotes", function(req, res){
        db.scrapedData.find({}, function(err, result){
            if(err){
                console.log(err)
            } else {
                res.json(result)
            }
        })
    })
    app.post("/data/postNote", function(req, res){
        console.log(req);
        // db.notes.create(req.body)
    })
}