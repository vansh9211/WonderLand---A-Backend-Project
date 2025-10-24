const express = require("express");
const router = express.Router();

const multer = require('multer');

const {storage} = require('../CloudCongif.js');
const upload = multer( {storage});

const ExpressError = require("../ErrorClass/ExpressError.js");
const { listingSchema } = require("../schema.js");

const { isLoggedIn, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");

// Joi validation middleware (omitted for brevity)
const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) return next(new ExpressError(400, error.details[0].message));
  next();
};

// Index Route: Get all listings (Handles filtering via req.query)
router.get("/", listingController.index);

// Create new listing form
router.get("/new", isLoggedIn, listingController.renderNewListForm);

// Create new listing
router.post("/", isLoggedIn, upload.single('newListObj[image]') ,validateSchema, listingController.addNewList);

// Show listing + reviews
router.get("/:id", listingController.showEachList);

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

// Update listing
router.put("/:id", isLoggedIn, isOwner, validateSchema, listingController.updateList);

// Delete listing
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteList);

module.exports = router;
