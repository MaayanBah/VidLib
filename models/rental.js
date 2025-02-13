const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 10,
        },
        required: true,
      }),
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
        required: true,
      }),
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate(movie);
}

exports.Rental = Rental;
exports.validate = validateRental;
