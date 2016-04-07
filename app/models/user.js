
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

/**
 * User schema
 */

var UserSchema = new Schema({
  
  facebookId: String,
  displayName: String,
  username: String,
  provider: String,
  about: String,
  age: Number,
  love: [String],
  workplace: String,
  favorite: [String],
  friends: [String],
  notification: {date: Date ,name: String,title: String ,image: String,eventID: String},
  newNotification: {date: Date ,name: String,title: String ,image: String,eventID: String},
  achievement: {date: Date ,title: String ,checked: Boolean},
  newFeed: {date: Date,profileName:String,profilePic:String,picture:String,title: String,description:String,love:{userID:String},comment:{userName:String,post:String,date:Date}},
  receipt: {date:Date,price:Number,place:String,name:String,event:String},
  stat:{sport:String,hour:Number,comment:Number},
});

module.exports = mongoose.model('User', UserSchema);


