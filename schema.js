const Joi = require("joi");

const listingSchema = Joi.object({
  newListObj: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow('')
  }).required()
});

const ReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});

module.exports = { listingSchema, ReviewSchema };
