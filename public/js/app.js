var content = $("#contentDiv");

$(document).ready(function(){
    onLoad();
})

$(document).on("click", "#scraperBtn", function(){
    scrape();
})

$(document).on("click", ".noteBtn", function(){
    var parElement = $(this).parent();
    var inputDiv = $("<div class = 'inputDiv' ></div>");
    var input = $("<input class = 'inputForm' name = 'note' placeholder = 'Write Note Here!'></input><button class = 'btn btn-success submitBtn'>Submit!</button>");
    $(input).appendTo(inputDiv);
    $(inputDiv).appendTo(parElement);
})

$(document).on("click", ".submitBtn", function(){
    var parElement = $(this).parent();
    var text = parElement.children("input").val().trim();
    console.log(text);
    $.post("/data/postNote", text, function(){
        console.log("post request made. text = ", text);
    })
})

function onLoad(){
    $.get("/data/getAll", function(data){
        console.log("Grabbing data from MongoDB...")
        console.log(data);
        $(content).empty();
        lister(data)
    });
}
function scrape(){
    $.get("/scrape", function(data){
        console.log("scraping data:")
        console.log(data);
        console.log("Saved to Mongo")
        // lister(data);
    }).then(function(){
        $.get("/data/getAll", function(data){
            console.log("Grabbing data from MongoDB...")
            console.log(data);
            $(content).empty();
            lister(data)
        });
    });
}

function lister(data){
    for( var i = 0; i < data.length; i++){
        var num = i + 1;
        
        var article = $("<div id = 'article" + num + "' class = 'row articleRow'></div><br>")
        var img = $("<div class = 'col-4 text-center imgDivs'><a href = '" + data[i].link + "'><img src = " + data[i].img + " alt = '" + data[i].title + "' class = 'img-fluid mx-auto my-auto articleImg'></a></div>")
        var words = $("<div class = 'col-8 textHolder'></div>");
        var title = $("<h3 id = 'title" + num + "' class = 'articleTitle'><a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].title + "</a></h3>");
        var link = $("<a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].link + "</a>");
        var summary = $("<p id = 'p" + num + "'>" + data[i].summary + "</p>");
        var btmLinks = $("<a class = 'noteBtn align-text-bottom' href = '#'>Leave a comment</a> | <a class = 'align-text-bottom' href = '#'>Save for later</a>")

        $(article).append(img);
        $(words).append(title);
        $(words).append(link);
        $(words).append(summary);
        $(words).append(btmLinks);
        $(article).append(words);
        $(content).append(article)
    }
}