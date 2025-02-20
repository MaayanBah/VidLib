const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Rental management and return functionality
 */

/**
 * @swagger
 * /returns:
 *   post:
 *     summary: Return a movie rental
 *     description: Processes a movie return by updating the rental record and the stock of the movie.
 *     tags: [Rentals]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer returning the movie
 *               movieId:
 *                 type: string
 *                 description: The ID of the movie being returned
 *             required:
 *               - customerId
 *               - movieId
 *     responses:
 *       200:
 *         description: The rental object after successful return
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Bad request, such as invalid data or return already processed
 *       401:
 *         description: Unauthorized, missing or invalid authentication token
 *       404:
 *         description: Rental not found
 *       500:
 *         description: Internal server error
 */
router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("return already processed");

  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  return res.status(200).send(rental);
});

module.exports = router;
