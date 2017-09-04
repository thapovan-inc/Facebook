var FB = require('fb');
var express = require('express');
var passport = require('passport');
var Facebook = require("./facebook");
var Strategy = require('passport-facebook').Strategy;

var access_token='',id='';


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: '1112933155509561',
    clientSecret: '122ad9e725079d39d7536c97502297cb',
    callbackURL: 'http://localhost:3001/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken);
    console.log(profile);
    id = profile.id;
    access_token = accessToken;
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { profile: Facebook.getProfileData(req,res,id,access_token)});
  });

  app.post("/update",function(req,res){
    /*FB.setAccessToken(access_token); */
    var body = req.body.feed;
  /*  FB.api('me/feed', 'post', { message: body }, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.id);
    }); */
    Facebook.postStatus(req,res,access_token,body);
    res.redirect("/postSucceeded")
  });

app.get("/postSucceeded",function(req,res){
  res.render("postSuccess");
});

app.listen(3001,function(){
  console.log("App started...")
});
