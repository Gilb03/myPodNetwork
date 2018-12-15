var express = require("express");
var router = express.Router();
var Podcast = require("../models/podcast");


//INDEX ROUTE
router.get("/", function (req, res){
    Podcast.find({}, function(err, allPodcasts){
        if(err){
            console.log(err);
        } else {
            res.render("podcasts/index", {podcasts:allPodcasts, currentUser: req.user});
        }
    });   
});

//CREATE ROUTE
router.post("/", isLoggedIn, function (req, res){
    var username = req.body.username,
        author = {
            id: req.user._id,
            username: req.user.username
        }, //ou added this tonight bruh
      image = req.body.image,
      description = req.body.description,
      newPodcast = {  name: name,  image: image,  description: description, author: author }
  //  create a new podcast and save to dB
      Podcast.create(newPodcast, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to podcasts page
            console.log(newlyCreated);
            res.redirect("/podcasts");
        }
      });
});
//new -show form to create new podcast
router.get("/new", isLoggedIn, function (req, res){
    res.render("podcasts/new");
});

//SHOW Route -shows more info about one podcast
router.get("/:id", function(req, res){
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

//EDIT PODCAST ROUTE *no issues found*
router.get("/:id/edit", checkPodcastOwnership, function(req, res){
    Podcast.findById(req.params.id, function(err, foundPodcast){
     res.render("podcasts/edit", {podcast: foundPodcast}); 
   });
});
//UPDATE PODCAST ROUTE 
router.put("/:id", checkPodcastOwnership, function(req, res){
    //find and update the correct podcast
    Podcast.findByIdAndUpdate(req.params.id, req.body.podcast, function(err, updatedPodcast){
        if(err){
            res.redirect("/podcasts");
        } else {
                res.redirect("/podcasts/" + req.params.id);
        }
    });
});

//DESTROY PODCAST ROUTE
router.delete("/:id", checkPodcastOwnership, function(req, res){
   Podcast.findByIdAndRemove(req.params.id, function(err){
       if(err){
            res.redirect("/podcasts");
        } else {
            res.redirect("/podcasts");
        }
    });
});


// MIDDLEWARE
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
res.redirect("/login"); 

}
 
  function checkPodcastOwnership(req, res, next) {
      if(req.isAuthenticated()){
          Podcast.findById(req.params.id, function(err, foundPodcast){
              if(err){
                  res.redirect("back");
              } else {
                  if(foundPodcast.author.id.equals(req.user._id)){
                      next();
                  } else {
                      res.redirect("back");
                  }
              }
          });
      }
  }
module.exports = router;