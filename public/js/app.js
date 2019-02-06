var content = $("#contentDiv");

//Loads previously stored Articles
$(document).ready(function(){
    onLoad();
})

//Scrapes website on button click
$(document).on("click", "#scraperBtn", function(event){
    event.preventDefault();
    scrape();
})

// Show/Hide Note Input
$(document).on("click", ".noteBtn", function(event){
    event.preventDefault();

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

// Show Notes
$(document).on("click", ".viewBtn", function(event){
    event.preventDefault();

    var articleDiv = $(this).parent().parent();
    var idNum = $(articleDiv).attr("idNumber")
    var noteDiv = $(articleDiv).find(".noteDiv");
    
    $(noteDiv).removeClass("hidden")
    $(this).removeClass("viewBtn");
    $(this).addClass("hideBtn")
    noteFinder(noteDiv, idNum);
})

// Hide Notes
$(document).on("click", ".hideBtn", function(event){
    event.preventDefault();
    
    var articleDiv = $(this).parent().parent();
    var noteDiv = $(articleDiv).find(".noteDiv");

    $(this).removeClass("hideBtn");
    $(this).addClass("viewBtn");
    $(noteDiv).addClass("animated fadeOut");
    setTimeout(function(){
        $(noteDiv).removeClass("animated fadeOut")
        $(noteDiv).addClass("hidden")
    }, 1000)
})

//Submit Note
$(document).on("click", ".submitBtn", function(){
    var parElement = $(this).parent();
    var text = parElement.children("input").val().trim();
    var idNumber = parElement.parent().parent().attr("idNumber");
    var nDiv = parElement.parent().parent().find(".noteDiv")
    var data = {
        articleId: idNumber,
        body: text
    }
    console.log("Submiting: ", text);
    console.log(idNumber);
    
    $.post("/data/postNote/" + idNumber, data, function(data){
        console.log("post request made. text = ", text);
        console.log("response:");
        console.log(data)
    }).then(function(){
        noteFinder(nDiv, idNumber)
    })
})

//Loads all Articles
function onLoad(){
    $.get("/data/getAll", function(data){
        console.log("Grabbing data from MongoDB...")
        console.log(data);
        $(content).empty();
        lister(data);
    });
}

//Scrapes Website
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

//Renders Article List
function lister(data){
    for( var i = 0; i < data.length; i++){
        var num = i + 1;
        var idNum = data[i]._id;
        var artDiv = 'article' + num;
        
        var article = $("<div id = 'article" + num + "' class = 'row articleRow animated fadeIn' idNumber = '" + idNum + "'></div>")
        var img = $("<div class = 'col-4 text-center imgDivs'><a href = '" + data[i].link + "'><img src = " + data[i].img + " alt = '" + data[i].title + "' class = 'img-fluid mx-auto my-auto articleImg'></a></div>")
        var words = $("<div class = 'col-8 textHolder'></div>");
        var title = $("<h3 id = 'title" + num + "' class = 'articleTitle'><a id = 'link" + num + "' href = '" + data[i].link + "' target = '_blank'>" + data[i].title + "</a></h3>");
        var link = $("<a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].link + "</a>");
        var summary = $("<p id = 'p" + num + "'>" + data[i].summary + "</p>");
        var btmLinks = $("<a class = 'noteBtn align-text-bottom' href = '#'>Leave a comment</a> | <a class = 'viewBtn align-text-bottom' href = '#'>View Notes</a>")
        var noteDiv = $("<div id = noteDiv" + num + " class = 'noteDiv'></div>")
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
        $(article).append(noteDiv);
        $(content).append(article);
        $(article).after("<br>")
        $(article).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            $(article).removeClass('animated fadeIn');
        });

        // $.get("/data/getNotes/" + data[i]._id, function(req, res){
        //     // console.log("Result:", res);
        //     // $(noteDiv).append(res);
        //     placeNote(artDiv, idNum);
        // })

        // noteFinder(artDiv, idNum)
    }
}

//Grabs Notes and renders them.
function noteFinder(nDiv, idNum){
    $.get("/data/getNotes/" + idNum, function(req, res){
        
        // console.log("Result:", res);
        // $(noteDiv).append(res);

        // placeNote(artDiv, idNum);
    }).then(function(data){
        
        console.log(data);
        // console.log(artDiv);
        console.log(nDiv);
        $(nDiv).empty()
        for( var i = 0; i < data.length; i++){
            var newNote = $("<div class = 'note animated fadeIn'></div>");
            var title = $("<p><em>Note Created on : " + data[i].createdAt + "</em></p>");
            var body = $("<p>" + data[i].body + "</p>")
            
            $(newNote).append(title);
            $(newNote).append(body);
            $(nDiv).append(newNote);

            $(".note").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                $(".note").removeClass('animated fadeIn');
            });

        }
    })
}
// function placeNote(articleDiv, idNum){
//     var thisDiv = document.getElementById(articleDiv)
//     console.log(thisDiv)
//     console.log(idNum);\
// }