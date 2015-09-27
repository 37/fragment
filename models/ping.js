//* **********************************************
//*   MongoDB schema declaration for sightings
//* **********************************************
var mongoose = require('mongoose');

var pingSchema = new mongoose.Schema({
  facebook: String,
  sighting: {
    location: { type: String, default: '' },
    picture: { type: String, default: '' },
    date: { type: Date, default: '' },
  }
});

/**
 * User sighting datesave
 */

pingSchema.pre('save', function(next) {
  now = new Date();
  this.sighting.date = now;
  next();
});

/**
 * Helper method for getting user's gravatar.
 */

module.exports = mongoose.model('ping', pingSchema);
