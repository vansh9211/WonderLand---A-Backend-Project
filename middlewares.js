module.exports.isLoggedIn = (req, resp, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;
    req.flash("error", "You need to login first");
    return resp.redirect("/login");
  } else {
    next();
  }
};

const Listing = require('./models/listing.js');

module.exports.isOwner = async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error" , "You don't have permission to edit these list");
    return res.redirect(`/listing/${id}`);
  }
  next();
}