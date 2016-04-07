
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * Event schema
 */

var EventSchema = new Schema({
  createdId: String,
  joinPerson: [{user_id:String}],
  maxPerson: Number,
  place: String,
  description: String,
  latitude: Number,
  longitude: Number,
  startTime: { type: Date, default: Date.now },
  finishTime: Date,
  type: String,
  author: String,
  price: Number,
  image: String,
  bg: String,
  pic: String,
});

module.exports = mongoose.model('Event', EventSchema);