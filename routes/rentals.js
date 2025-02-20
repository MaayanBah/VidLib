const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const validate = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Rental management and retrieval
 */

/**
 * @swagger
 * /rentals:
 *   get:
 *     summary: Retrieve all rentals
 *     description: Returns a list of all rentals, sorted by date (most recent first).
 *     tags: [Rentals]
 *     responses:
 *       200:
 *         description: A list of rentals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const movies = await Rental.find().sort("-dateOut");
  res.send(movies);
});

/**
 * @swagger
 * /rentals/{id}:
 *   get:
 *     summary: Get rental by ID
 *     description: Returns a rental by its ID.
 *     tags: [Rentals]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the rental
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A rental object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Rental not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  const rental = Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

/**
 * @swagger
 * /rentals:
 *   post:
 *     summary: Create a new rental
 *     description: Creates a new rental transaction in the system.
 *     tags: [Rentals]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rental'
 *     responses:
 *       200:
 *         description: The created rental object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Invalid data (e.g., invalid movie or customer)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

module.exports = router;
