
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
  like: Number,
  workplace: String,
  favorite: [String],
  friends: [{friendId: ObjectId}],
  notification: [ {date: {type: Date,default: Date.now} ,title: String ,checked: Boolean} ],
  achievement: [ {date: Date ,title: String ,checked: Boolean} ],

});

module.exports = mongoose.model('User', UserSchema);


