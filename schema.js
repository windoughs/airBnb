const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string().allow("",null),
    price:Joi.number().required().min(0),
    country:Joi.string().required(),
    location:Joi.string().required(),

    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),

    }).required()
})