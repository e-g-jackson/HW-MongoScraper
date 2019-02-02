// var path = require("path");
var cheerio = require("cheerio");
// var db = require(path.join(__dirname, "../models/model.js"));
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
                results.push({
                    "title": title,
                    "img": img,
                    "link": url,
                    "summary": summary
                });
            })
            console.log(results);
            res.send(results);
            // db.scraped.create(results)
            //  .then(function(dbArticle){
            //     console.log(dbArticle);
            //  })
            //  .catch(function(err){
            //     console.log(err);
            //  });
        })
    })
}