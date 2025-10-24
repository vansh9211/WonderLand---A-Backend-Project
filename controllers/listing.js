const Listing = require("../models/listing.js");
const ExpressError = require("../ErrorClass/ExpressError.js"); // Needed for error throws

module.exports.index = async (req, res, next) => {
    // CRITICAL FIX: Get the category filter from the URL query string
    const { category } = req.query;
    
    let allListingData;

    if (category) {
        allListingData = await Listing.find({ category: category });
        
        if (allListingData.length === 0) {
            // Flash error message if no listings are found in that category
            req.flash("error", `No listings found in the '${category}' category.`);
            // Fallback to show all listings
            allListingData = await Listing.find({}); 
        }

    } else {
        // Default: Show all listings when no category is specified
        allListingData = await Listing.find({});
    }

    res.render("AllListing", { allListingData });
};

module.exports.renderNewListForm = (req, resp) => {
    resp.render("CreateNew");
};

module.exports.addNewList = async (req, res, next) => {
    try {
        // NOTE: If you are using Cloudinary, you should handle req.file.path/filename here.
        const newListObj = req.body.newListObj;
        newListObj.owner = req.user._id;
        await Listing.create(newListObj);
        req.flash("success", "New listing created successfully"); // Using 'success' key
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
        if (!list) return new ExpressError(404, "Listing not found");
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
    // Assuming Mongoose middleware handles the review deletion
    await Listing.findByIdAndDelete(id); 
    req.flash("success", "Listing Deleted Successfully"); // Using 'success' key
    
    res.redirect("/listing");
};
