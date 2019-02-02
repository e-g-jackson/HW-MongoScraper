var mongoose = require('mongoose');

var schema = mongoose.schema;

var ArticleSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: false
    },
    link:{
        type: String,
        required: true
    }
})

var scraped = mongoose.model("scraped", ArticleSchema);

module.exports = scraped;