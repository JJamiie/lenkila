

// import module dependencies
var mongoose = require('mongoose');
var home = require('home');
var fs = require('fs');
var Schema = mongoose.Schema;
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
            about: "",
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

  app.get('/getProfile/:facebookId',function(req,res){
    var userId = req.params.facebookId;
    console.log(userId);
    User.findOne({facebookId: userId},
      function(err,user){

      if(err){
        return done(err);
      }else{
      console.log(user);
      res.send(user);
    }
    });
  });
  ////////////////////////////////////    REQUEST CSRF    ////////////////////////////////////
  
  app.get('/requestCsrf', function(req,res){
    res.send(req.csrfToken());
  });
  ////////////////////////////////////    EVENT    ////////////////////////////////////
  app.post('/addNewNotification',function(req,res){
    // console.log(req.body.noti.title);
    console.log(req.body.noti.user_id);
    var title = req.body.noti.title;
    var date  = req.body.noti.date;
    var name = req.body.noti.name;
    var image = req.body.noti.image;
    var eventId = req.body.noti.eventId;
    var notification = {date:date,name:name,title:title,image:image,eventID:eventId};

    // User.findOne({facebookId:req.body.noti.user_id},function(err,user){
    //     console.log(user);
    // });
  console.log(notification);
    User.findOne({facebookId:req.body.noti.user_id},function(err,user){
      console.log(user);
      user.update({$push: { "newNotification": notification}},
        {safe: true, upsert: true}, function(err, user){
          if(err){
            console.log("error");
          }else{
          res.redirect('/');  
        }
        });
    });
        
});
  app.post('/addNotification',function(req,res){
    // console.log(req.body.noti.title);
    console.log(req.body.noti.user_id);
    var title = req.body.noti.title;
    var date  = req.body.noti.date;
    var name = req.body.noti.name;
    var image = req.body.noti.image;
    var eventId = req.body.noti.eventId;
    var notification = {date:date,name:name,title:title,image:image,eventID:eventId};

    // User.findOne({facebookId:req.body.noti.user_id},function(err,user){
    //     console.log(user);
    // });
  console.log(notification);
    User.findOne({facebookId:req.body.noti.user_id},function(err,user){
      user.update({$push: { "notification": notification}},
        {safe: true, upsert: true}, function(err, user){
          if(err){
            console.log("error");
          }else{
          res.redirect('/');  
        }
        });
    });
        
});
  app.post('/removeNewNotification',function(req,res){
    // console.log(req.body.noti.title);
    // User.findOne({facebookId:req.body.noti.user_id},function(err,user){
    //     console.log(user);
    // });
    User.findOne({facebookId:req.body.noti.user_id},function(err,user){
      user.update({$pop: { "newNotification": -1}},
        {safe: true, upsert: true}, function(err, user){
          if(err){
            console.log("error");
          }else{
          res.redirect('/');  
        }
        });
    });
        
});
  app.post('/removePlayer',function(req,res){
    Event.findOne(req.body.message.eventId,function(err,event){

      event.update({$pull:{joinPerson:{user_id:req.body.message.user_id}}},function(err,event){
          if(err){
            console.log("error");
          }else{
            console.log("sdsd");
            res.redirect('/'); 
          }
    });
  });
  });
  app.post('/removeEvent',function(req,res){
    console.log("sdsd")
    Event.remove({_id:req.body.message.eventId},function(err,event){
      if(err){
        console.log(err);
      }else{
        console.log(event);
        res.redirect('/');
      }
    });
  });
  app.post('/addEvent', function(req, res){
    console.log(req);
    var event = Event({
      createdId: req.body.message.createdId,
      maxPerson: req.body.message.maxPerson,
      place: req.body.message.place,
      description: req.body.message.description,
      latitude: req.body.message.latitude,
      longitude: req.body.message.longitude,
      startTime: req.body.message.startTime,
      finishTime: req.body.message.finishTime,
      type: req.body.message.type,
      author: req.body.message.author,
      price: req.body.message.price,
      image: req.body.message.image,
      bg: req.body.message.bg,
      pic: req.body.message.pic,
      joinPerson: req.body.message.joinPerson
    });
    event.save(function(err){
            if(err){ console.log(err);}
else{
    console.log(event);
    res.redirect('/');
  }
});
});
app.post('/addUser',function(req,res){
  console.log(req);
  var user = User({
    facebookId: req.body.message.facebookId,
    displayName: req.body.message.displayName,
    friends: req.body.message.friends,
    about:"add about me",
    notification:req.body.message.noti,
    newNotification:req.body.message.noti,
    provider:"facebook"
  });
  user.save(function(err){
      if(err){console.log(err)}
      else{
        console.log(user);
        res.redirect('/');
      }
  });
});
app.post('/addAchievement',function(req,res){
  console.log("sds");
  console.log(req.body.message.title);
  var title = req.body.message.title;
  var date = req.body.message.date;
  var checked = req.body.message.checked;
  var achievement = {date:date,title:title,checked:checked}
  User.findOne({facebookId:req.body.message.user_id},function(err,user){
    console.log(user);
    User.update({$push:{"achievement":achievement}},function(err,user){
      if(err){
        console.log(err);
      }else{
        console.log(user);
        res.redirect('/');
      }
    });
  });
});
app.post('addOther',function(req,res){
  User.findOne({facebookId:req.body.message.user_id},function(err,user){

  });
});
app.post('/addNewNotification',function(req,res){
    // console.log(req.body.noti.title);
    console.log(req.body.noti.user_id);
    var title = req.body.noti.title;
    var date  = req.body.noti.date;
    var name = req.body.noti.name;
    var image = req.body.noti.image;
    var eventId = req.body.noti.eventId;
    var notification = {date:date,name:name,title:title,image:image,eventID:eventId};

    // User.findOne({facebookId:req.body.noti.user_id},function(err,user){
    //     console.log(user);
    // });
  console.log(notification);
    User.findOne({facebookId:req.body.noti.user_id},function(err,user){
      console.log(user);
      user.update({$push: { "newNotification": notification}},
        {safe: true, upsert: true}, function(err, user){
          if(err){
            console.log("error");
          }else{
          res.redirect('/');  
        }
        });
    });
        
});
  app.get('/searchEvent/:type',function(req,res){
    Event.find({type:{$regex:'.*'+req.params.type+'.*'}},
      function(err,event){
        if(err){
          console.log(err);
        }else{
          console.log(event);
          res.send(event);
        }
      });
  });
  app.get('/updatePlayer/:eventId',function(req,res){
    console.log(req.params.eventId);
    Event.findOne({_id:req.params.eventId },
      function(error,event){
      if(error){
        console.log(error);
      }else{
      console.log(event);
      res.send(event);
    }
    });
  });
  app.post('/joinEvent',function(req,res){
    Event.findByIdAndUpdate(req.body.message.eventId,
        {$push: { "joinPerson": req.body.message.user_id}},
        {safe: true, upsert: true}, function(err, user){
          console.log(req.body.message.user_id);
          console.log(req.body.message.eventId);
          res.redirect('/');  
        });
    
  });

  app.get('/deleteEvent',function(req,res){
    Event.findOne({_id: req.message.eventId}).remove(function(err){
        res.redirect('/');
    });
  });

  app.get('/getEvent',function(req,res){
    var isodate = new Date()
    isodate.setHours(isodate.getHours()+7)
    Event.find({startTime: {$gte: isodate}},
      function(err,event){
      if(err){
        console.log(err);
      }else{
      console.log(event);
      res.send(event);
    }
    }).sort({startTime:1});
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





