var content = $("#contentDiv");
var sBtn = $("#scraperBtn");

$(document).on("click", sBtn, function(){
    $.get("/scrape", function(data){
        console.log(data);
        lister(data);
    })
})

function lister(data){
    for( var i = 0; i < data.length; i++){
        var num = i + 1;
        
        var article = $("<div id = 'article" + num + "' class = 'row'></div><br>")
        var img = $("<div class = 'col-3'><a href = '" + data[i].link + "'><img src = " + data[i].img + " alt = '" + data[i].title + "' class = 'img-fluid'></a></div>")
        var words = $("<div class = 'col-9'></div>");
        var title = $("<i class = 'far fa-paper-plane fa-2x float-left'></i><h3 id = 'title" + num + "'>" + data[i].title + "</h3>");
        var link = $("<a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].link + "</a>");
        var summary = $("<p id = 'p" + num + "'>" + data[i].summary + "</p>");

        $(article).append(img);
        $(words).append(title);
        $(words).append(link);
        $(words).append(summary);
        $(article).append(words);
        $(content).append(article)
    }
}