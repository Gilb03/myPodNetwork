var mongoose = require("mongoose");
var Podcast = require("./models/podcast");
var Comment = require("./models/comment");
var data =[
    {  name:'The 2nd Shift Podcast', 
     image:'https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677_960_720.jpg', 
     description: 'A real cool place to be man'},

    {  name:'The Shoot Your Shot Podcast', 
    image:'https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677_960_720.jpg',
     description: 'cool stuff '},

    {  name:'The B. Inspired Podcast', 
    image:'https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677_960_720.jpg',
     description: 'Stay motivated and shit ' }
]

function seedDB(){ 
    //remove all camgrounds
    Podcast.remove({}, function (err){
    if(err){
        console.log(err);
    } else {
    console.log("removed podcasts!");
    //add a few podcasts
    data.forEach(function(seed){
        Podcast.create(seed, function(err, podcast){
            if (err){
                console.log(err)
            } else {
                console.log("added a podcast");
                //create a comment 
                Comment.create(
                    {text: "this place is great",
                             author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                    podcast.comments.push(comment);
                                podcast.save();
                                console.log("Created new comment");
                                }
                            });

                            
            }
        });
    });
    }
});

//add a few comments
}
module.exports = seedDB;