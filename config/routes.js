

// import module dependencies
var mongoose = require('mongoose');
var home = require('home');
var bodyParser = require('body-parser'); // can read JSON
var csrf = require('csurf');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;


//import database
var User = require('../app/models/user');
var Event = require('../app/models/event');


// static variable 
var FACEBOOK_APP_ID = "1678551372433009";
var FACEBOOK_APP_SECRET = "04edd17ba95889350ba070e0db102d27";

/**
 * Expose
 */

module.exports = function (app, passport) {
  //configuration
  app.use(csrf());

  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebookId': profile.id }, function(err, user) {
        if (err) { 
          return done(err); 
        }
        //no user was found, create a new user from
        if(!user){
          user = new User({
            facebookId: profile.id,
            displayName: profile.displayName,
            username: profile.username,
            provider: profile.provider,
          });
          user.save(function(err){
            if(err) console.log(err);
            return done(err,user);
          });
        }else{
          return done(null, user);
        }
      });
    }
  ));

  ////////////////////////////////////    USER    ////////////////////////////////////
  app.get('/auth/facebook',passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/test' }),
    function(req, res) {
      res.redirect('/');
    });
  
  app.get('/logout',function(req,res){
    req.logout()
    res.redirect('/')
  });

  app.post('/addFriend',function(req,res){
    User.findByIdAndUpdate(req.message.userId,
        {$push: {"friends": req.message.friendId}},
        {safe: true, upsert: true}, function(err, user){
          if(err){
            return done(err)
          }
          res.redirect('/');  
        });
  });

  app.get('/getProfile/:userId',function(req,res){
    var userId = req.params.userId
    User.findOne({_id: userId},function(err,user){
      if(err){
        return done(err)
      }
      res.send(user)
    })
  });

  ////////////////////////////////////    REQUEST CSRF    ////////////////////////////////////
  
  app.get('/requestCsrf', function(req,res){
    res.send(req.csrfToken());
  });

  ////////////////////////////////////    EVENT    ////////////////////////////////////

  app.post('/addEvent', function(req, res){
    var event = Event({
      createdId: req.message.userId,
      joinPerson: req.message.userId,
      maxPerson: req.message.maxPerson,
      price: req.message.price,
      place: req.message.place,
      description: req.message.description,
      latitude: req.message.latitude,
      longitude: req.message.longitude,
      startTime: req.message.startTime,
      finishTime: req.message.finishTime,
      type: req.message.type
    });

    event.save(function(err, group) {
      if(err) throw err;
    });
    res.redirect('/');
  });

  app.post('/joinEvent',function(req,res){
    Event.findByIdAndUpdate(req.message.eventId,
        {$push: {"joinPerson": req.message.userId}},
        {safe: true, upsert: true}, function(err, user){
          res.redirect('/');  
        });
  });

  app.get('/deleteEvent',function(req,res){
    Event.findOne({_id: req.message.eventId}).remove(function(err){
        res.redirect('/');
    });
  });

  app.get('/getEvent/:eventId',function(req,res){
    var userId = req.params.eventId
    Event.findOne({_id: userId},function(err,event){
      if(err){
        return done(err)
      }
      res.send(event)
    })
  });

  ////////////////////////////////////    TEST    ////////////////////////////////////
  app.get('/', home.index);

  app.get('/test', function(req, res) {
        res.render('test.ejs', { csrf: req.csrfToken() });
  });

  

  ////////////////////////////////////    ERROR HANDLING    ////////////////////////////////////
  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });



};





