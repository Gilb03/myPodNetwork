var mongoose = require("mongoose");


const podcastSchema = new mongoose.Schema({
    name: 'String',
    image: 'String',
    description: 'String',
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
module.exports = mongoose.model("Podcast", podcastSchema);