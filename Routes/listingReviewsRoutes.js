const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../ErrorClass/ExpressError.js");

const { ReviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middlewares.js");

const reviewsController = require("../controllers/review.js");

// Joi validation
const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) return next(new ExpressError(400, error.details[0].message));
  next();
};

// Add a review
router.post("/", isLoggedIn, validateReview, reviewsController.addReview);

router.delete("/:reviewId",isLoggedIn,isOwner,reviewsController.deleteReview);

module.exports = router;
