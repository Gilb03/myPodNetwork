var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Podcast = require('./models/podcast'),
    Comment = require('./models/comment'),
    User    = require('./models/user');
  // seedDB = require('./seeds');

//REQUIRING ROUTES
const commentRoutes = require("./routes/comments");
var podcastRoutes = require("./routes/podcasts");
var indexRoutes = require("./routes/index");



mongoose.connect('mongodb://localhost/mypod_camp'); 
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
 // seedDB(); 


//PASSPORT CONFIGURATION
app.use(require("express-session")({
secret:  "Rusty wins cutest dog" ,
resave: false,
saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/podcasts", podcastRoutes);
app.use("/podcasts/:id/comments", commentRoutes);

const port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server is listening on port: ' + port)
module.exports = app
});