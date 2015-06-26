/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  if (req.user && req.user.isTourGuide) return res.redirect('/experiences/all');

  res.render('home', {
    title: 'Home'
  });
};
