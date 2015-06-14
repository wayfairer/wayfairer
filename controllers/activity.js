var Activity = require('../models/Activity');
var User = require('../models/User');
var cloudinary = require('cloudinary');

/**
 * GET /experiences/all
 * Activities list all.
 */

exports.getAll = function(req, res) {

  Activity.find({}, function(err, activities) {
    if (err) return next(err);

    res.render('activity/all', {
    	title: 'All Experiences',
    	activities: activities
  	});
  });
};

/**
 * GET /view/id
 * Show experience page
 */

exports.getActivity = function(req, res) {

  var id = req.params.id;

  // Find activity
  Activity.findById(id, function(err, activity) {
    if (err) return res.render('error/not-found');

    // Find get activities user profile
    console.log(activity);

    User.findById(activity.userId, function(err, user) {
      if (err) return res.end('error')

      console.log(user);
      var ownerProfile = user ? user.profile : null;

      // If the user requesting data is logged in as activity owner
      var isOwner = false;
      if (req.user) {
        isOwner = activity.userId == req.user.id ? true : false;
      }

      res.render('activity/index', {
        title: activity.title,
        activity: activity,
        ownerProfile: ownerProfile,
        isOwner: isOwner 

      });
    });

  });
};


/**
 * GET /experience/new
 * Add new experience form
 */
exports.getNewActivity = function(req, res) {
    res.render('activity/new', {
    	title: 'New Experience'
  	});
};



/**
 * POST /experience/new
 * Adds an experience
 * @param title
 * @param description
 * @param userId
 */

exports.postNewActivity = function(req, res) {
  
  // Handle errors
  /*req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('description', 'Description cannot be blank').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/experience/new');
  }*/


  // Build activity object
  var title = req.body.title;
  var strapline = req.body.strapline;
  var description = req.body.description;
  var userId = req.user._id;
  var status = req.body.status;
  var slug = makeSlug(title + " " + userId); // TODO change userId to datetime
  var cost = req.body.cost;
  var acceptedCurrency = req.body.acceptedCurrency;
  var address = req.body.address;
  var availability = req.body.availability;

  var activity = new Activity({
    title: title,
    strapline: strapline,
    slug: slug,
    description: description,
    userId: userId,
    status: status,
    cost: cost,
    acceptedCurrency: acceptedCurrency,
    address: address,
    availability: availability,
    media: {
      img: {
        _default: "",
        cover: ""
      }
    }
  });


  // Upload image, then call complete
  var imageURL = "";
  if (req.files.image && req.files.image.path) {
    cloudinary.uploader.upload(req.files.image.path, function(result) {
      if (result.url) {
        imageURL = result.url;
        complete();
      } else {
        console.log('error');
        return res.redirect('/experience/new');
      }
    });
  } else {
    complete();
  }


  function complete() {
    activity.media.img._default = imageURL;
    activity.media.img.cover = imageURL;

    activity.save(function(err, activity) {
      if (err) return next(err);
      console.log('activity saved');
      return res.redirect('/view/'+activity.id);
    });
  }


};



/**
 * GET /edit/aid
 * Edit an experience form
 */

exports.getUpdateActivity = function(req, res) {

  var id = req.params.id;

  Activity.findById(id, function(err, activity) {
    if (err || (activity.userId != req.user.id)) return res.render('error/not-found');

    res.render('activity/edit', {
      title: 'Edit '+ activity.title,
      activity: activity
    });
  });
};



/**
 * POST /edit/aid
 * Edits an experience
 * @param title
 * @param description
 * @param userId
 */

exports.postUpdateActivity = function(req, res) {
  var aid = req.params.id;

  Activity.findById(aid, function(err, activity) {

    if (err || !req.user || (activity.userId != req.user.id) ) {
      req.flash('errors', { msg: 'Something went wrong' });
      return res.redirect('/');
    }

    activity.title = req.body.title;
    activity.strapline = req.body.strapline;
    activity.description = req.body.description;
    activity.status = req.body.status;
    activity.cost = req.body.cost;
    activity.acceptedCurrency = req.body.acceptedCurrency;
    activity.address = req.body.address;
    activity.availability = req.body.availability;
    //activity.media.img._default = req.body.image;
    //activity.media.img.cover = req.body.image;


    // Upload image, then call complete (ignore image upload error)
    var imageURL = "";

    if (req.body.currentCover)
      imageURL = req.body.currentCover;


    if (req.files.image && req.files.image.path) {
      cloudinary.uploader.upload(req.files.image.path, function(result) {
        if (result.url) {
          imageURL = result.url;
          complete();
        } else {
          console.log('error');
          complete();
        }
      });
    } else {
      complete();
    }

    function complete() {
      activity.media.img._default = imageURL;
      activity.media.img.cover = imageURL;

      activity.save(function(err) {
        if (err) return next(err);
        req.flash('success', { msg: 'Experience updated.' });
        res.redirect('/edit/'+activity._id);
      });
    }


  });
};


/**
 * makeSlug
 * Converts string to url-friendly-format
 * @param string
 */
function makeSlug(string) {
  return string
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}