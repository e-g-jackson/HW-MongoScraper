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
        
        var article = $("<div id = 'article" + num + "'></div>")
        var title = $("<h3 id = 'title" + num + "'>" + data[i].title + "</h3>");
        var link = $("<a id = 'link" + num + "' href = '" + data[i].link + "'>" + data[i].link + "</a>");
        var summary = $("<p id = 'p" + num + "'>" + data[i].summary + "</p>");

        $(article).append(title);
        $(article).append(link);
        $(article).append(summary);
        $(content).append(article);
    }
}