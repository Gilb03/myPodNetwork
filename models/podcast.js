var mongoose = require("mongoose");


var podcastSchema = new mongoose.Schema({
    name: 'String',
    image: 'String',
    description: 'String',
    link : 'String',
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
module.exports = mongoose.model("Podcast", podcastSchema);