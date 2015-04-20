/**
 * GET /how-it-works
 * How it works page.
 */

exports.getHowItWorks = function(req, res) {
  res.render('how-it-works', {title: 'How it works'});
};
