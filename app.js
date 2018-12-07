var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Podcast = require("./models/podcast");
var Comment = require("./models/comment");
var seedDB = require("./seeds");


mongoose.connect('mongodb://localhost/mypod_camp'); 
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");  
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


app.get( "/", function (req, res){
res.render("landing");
});
//index route - show all podcasts
app.get("/podcasts", function (req, res){
    //Get all podcasts from DB
    Podcast.find({}, function(err, allPodcasts){
        if(err){
            console.log(err);
        } else {
            res.render("podcasts/index", {podcasts:allPodcasts});
        }
    });   
});

//create route - add new podcasts
app.post("/podcasts", function (req, res){
    var name = req.body.name,
      image = req.body.image,
      description = req.body.description,
      newPodcast = {  name: name,  image: image,  description: description }
  //  create a new podcast and save to dB
      Podcast.create(newPodcast, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to podcasts page
            res.redirect("/podcasts");
        }
      });
});
//new -show form to create new podcast
app.get("/podcasts/new", function (req, res){
    res.render("podcasts/new");
});

//SHOW Route -shows more info about one podcast
app.get("/podcasts/:id", function(req, res){
    // find the podcast with provided ID
    Podcast.findById(req.params.id).populate("comments").exec(function(err, foundPodcast){
        if(err){
            console.log(err);
        } else {
            console.log(foundPodcast);
            //render show template with that podcast
            res.render("podcasts/show", {podcast: foundPodcast});
        }
    });
});

// ========================================
//COMMENT ROUTES
// ========================================

app.get("/podcasts/:id/comments/new", function(req, res){
    //find podcast by id
    Podcast.findById(req.params.id, function (err, podcast){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {podcast: podcast});
        }
    });
});
app.post("/podcasts/:id/comments", function(req, res){
//look up podcast using ID
Podcast.findById(req.params.id , function(err, podcast){
    if(err){
        console.log(err);
        res.redirect("/podcasts");
    } else {
    Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else {
            podcast.comments.push(comment);
            podcast.save();
            res.redirect("/podcasts/" + podcast._id);
        }
    });
        
     }
   });

});

const port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server is listening on port: ' + port)
module.exports = app
});