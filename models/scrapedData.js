var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        index: {unique: true, dropDups: true},
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

var scraped = mongoose.model("scraped", ArticleSchema);

module.exports = scraped;