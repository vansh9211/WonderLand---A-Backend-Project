const express = require("express");
const router = express.Router();

const ExpressError = require("../ErrorClass/ExpressError.js");
const { listingSchema } = require("../schema.js");

const { isLoggedIn, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");

// Joi validation middleware
const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) return next(new ExpressError(400, error.details[0].message));
  next();
};

// Get all listings
router.get("/", listingController.index);

// Create new listing form
router.get("/new", isLoggedIn, listingController.renderNewListForm);

// Create new listing
router.post("/", isLoggedIn, validateSchema, listingController.addNewList);

// Show listing + reviews
router.get("/:id", listingController.showEachList);

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

// Update listing
router.put("/:id", isLoggedIn, isOwner, validateSchema, listingController.updateList);

// Delete listing
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteList);

module.exports = router;
