var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  title:  { type: String, default: '' }, 
  slug:  { type: String, default: '' }, // used in URL, looks-like-this
  userId: Object,
  strapline: { type: String, default: '' },
  description:  { type: String, default: '' },
  status:  { type: String, default: '' }, // e.g. active or inactive
  tags: Array,
  cost: { type: String, default: '' },
  acceptedCurrency:  { type: String, default: '' }, 
  address: Array, // TODO replace with address line1, line2 etc.
  languages: Array, // TODO
  availability: String, // TODO change to date/time fields
  media: { // TODO
    img: {
      _default: { type: String, default: '' },
      cover: { type: String, default: '' }
    }
  }

  /*email: { type: String, unique: true, lowercase: true },
  password: String,
  isTourist: Boolean,
  isTourGuide: Boolean,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  tokens: Array,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date*/
});


/**
 * Helper method for validationg user's password.
 */
/*
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};
*/

module.exports = mongoose.model('Activity', activitySchema);
