var content = $("#contentDiv");

$(document).ready(function(){
    onLoad();
})

$(document).on("click", "#scraperBtn", function(){
    scrape();
})

$(document).on("click", ".noteBtn", function(){
    var parElement = $(this).parent();
    var input = $(parElement).find(".inputDiv");
    var check = $(input).attr("vis");
    if (check === "false"){
        $(input).removeClass("hidden");
        $(input).addClass("animated fadeIn");
        $(input).attr("vis", true)
        $(input).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            $(input).removeClass('animated fadeIn');
        });
    } else {
        $(input).addClass("animated fadeOut");
        $(input).attr("vis", false);
        $(input).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            $(input).removeClass('animated fadeOut');
            $(input).addClass("hidden")
        });
    }

})

$(document).on("click", ".submitBtn", function(){
    var parElement = $(this).parent();
    var text = parElement.children("input").val().trim();
    var idNumber = parElement.parent().parent().attr("idNumber");
    var data = {
        articleId: idNumber,
        body: text
    }
    console.log("Submiting: ", text);
    console.log(idNumber);
    
    $.post("/data/postNote/" + idNumber, data, function(){
        console.log("post request made. text = ", text);
    })
})

function onLoad(){
    $.get("/data/getAll", function(data){
        console.log("Grabbing data from MongoDB...")
        console.log(data);
        $(content).empty();
        lister(data);
    });
}

function scrape(){
    $.get("/scrape", function(data){
        console.log("scraping data...")
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
        
        var article = $("<div id = 'article" + num + "' class = 'row articleRow animated fadeIn' idNumber = '" + data[i]._id + "'></div>")
        var img = $("<div class = 'col-4 text-center imgDivs'><a href = '" + data[i].link + "'><img src = " + data[i].img + " alt = '" + data[i].title + "' class = 'img-fluid mx-auto my-auto articleImg'></a></div>")
        var words = $("<div class = 'col-8 textHolder'></div>");
        var title = $("<h3 id = 'title" + num + "' class = 'articleTitle'><a id = 'link" + num + "' href = '" + data[i].link + "' target = '_blank'>" + data[i].title + "</a></h3>");
        var link = $("<a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].link + "</a>");
        var summary = $("<p id = 'p" + num + "'>" + data[i].summary + "</p>");
        var btmLinks = $("<a class = 'noteBtn align-text-bottom' href = '#'>Leave a comment</a> | <a class = 'align-text-bottom' href = '#'>Save for later</a>")

        var inputDiv = $("<div class = 'inputDiv hidden' vis = false></div>");
        var input = $("<input class = 'inputForm' name = 'note' placeholder = 'Write Note Here!'></input><button class = 'btn btn-success submitBtn'>Submit!</button>");
        
        $(article).append(img);
        $(words).append(title);
        $(words).append(link);
        $(words).append(summary);
        $(words).append(btmLinks);
        $(words).append(inputDiv);
        $(inputDiv).append(input);
        $(article).append(words);
        $(content).append(article);
        $(article).after("<br>")
        $(article).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            $(article).removeClass('animated jackInTheBox');
        });
    }
}