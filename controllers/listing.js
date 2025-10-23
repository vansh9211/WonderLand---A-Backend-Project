const Listing = require("../models/listing.js");
const Review = require('../models/reviews.js');

module.exports.index = async (req, res, next) => {
  const allListingData = await Listing.find({});
  res.render("AllListing", { allListingData });
};

module.exports.renderNewListForm = (req, resp) => {
  resp.render("CreateNew");
};

module.exports.addNewList = async (req, res, next) => {
  try {
    const newListObj = req.body.newListObj;
    newListObj.owner = req.user._id;
    await Listing.create(newListObj);
    req.flash("listing", "New listing created");
    res.redirect("/listing");
  } catch (err) {
    next(err);
  }
};

module.exports.showEachList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!list) throw new ExpressError(404, "Listing not found");
    console.log(list);
    res.render("ShowList", { list });
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listData = await Listing.findById(id);
  if (!listData) return next(new ExpressError(404, "Listing not found"));
  res.render("EditList", { listData });
};

module.exports.updateList = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.newListObj });
  req.flash("success", "Listing updated successfully");

  res.redirect(`/listing/${id}`);
};

module.exports.deleteList = async (req, res, next) => {
  const { id } = req.params;
  let deletedListData = await Listing.findByIdAndDelete(id);

  for (let review of deletedListData.reviews) {
    await Review.findByIdAndDelete(review);
    req.flash("listing", "Listing Deleted Successfully");
  }
  res.redirect("/listing");
};
