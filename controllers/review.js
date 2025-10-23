const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) throw new ExpressError(404, "Listing not found");

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    list.reviews.push(newReview._id);
    await list.save();

    res.redirect(`/listing/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, resp) => {
  let { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  resp.redirect(`/listing/${id}`);
};
