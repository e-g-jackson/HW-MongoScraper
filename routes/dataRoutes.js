var path = require("path");
var cheerio = require("cheerio");
var db = require(path.join(__dirname, "../models/index.js"));
var axios = require("axios");

module.exports = function(app){
    //Scrape website
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
            });

            //results => database
            
            db.scrapedData.create(results)
             .then(function(dbArticle){
                console.log(dbArticle);
             })
             .catch(function(err){
                 if (err){
                    throw err;
                 }
             });
            console.log(results);
            res.send(results);
            
        });
    });
    //GET Articles
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
    
    //GET specific article's notes
    app.get("/data/getNotes/:id", function(req, res){
        var noteId = req.params.id;
        console.log('GET: req.params.id:');
        console.log(noteId);
        db.Note.find({articleId: noteId}, function(err, result){
            if(err){
                console.log(err)
            } else {
                console.log(result);
                res.json(result);
            }
        })
    })
    //POST note
    app.post("/data/postNote/:id", function(req, res){
        var noteId = req.params.id;
        console.log('POST: req.params.id:');
        console.log(noteId);
        
        db.Note.create(req.body)
             .then(function(note){
                console.log(note);
                res.send(note);
             })
             .catch(function(err){
                 if (err){
                    throw err;
                 }
             });
    })
}