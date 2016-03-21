
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
  createdId: ObjectId,
  joinPerson: [ObjectId],
  maxPerson: Number,
  place: String,
  description: String,
  latitude: Number,
  longitude: Number,
  startTime: { type: Date, default: Date.now },
  finishTime: Date,
  type: String
});

module.exports = mongoose.model('Event', EventSchema);