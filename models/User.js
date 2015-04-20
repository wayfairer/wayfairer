var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
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
    picture: { type: String, default: '' },
    position: String, // REDUNDANT
    role: {
      individual: Boolean,
      communityMember: Boolean,
      traditionalLandOwner: Boolean,
      culturalMediator: Boolean,
      culturalArtOrganisation: Boolean,
      tourismBureau: Boolean,
      educationProvider: Boolean,
      other: { type: String, default: '' }
    }, // e.g. Elder, if culturist, Traveller if wayfairer
    /*
    registration: {
      ngo: Boolean,
      sole: Boolean,
      govOrg: Boolean,
      socialEnterprise: Boolean,
      none: Boolean
    },*/
    registrationType: String,
    bio: String, // Long text description
    languages: { type: String, default: '' }, // String for now
    prefferedCommunication: { email: Boolean }, // e.g. e-mail, phone, Facebook
    phone: { type: String, default: '' },
    address: {} // TODO, maybe
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Password hashing Mongoose middleware.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(5, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validationg user's password.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */

userSchema.methods.gravatar = function(size) {
  if (!size) { size = 200; }

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
