const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Genre, validateGenre } = require("../models/genre");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Genre management and retrieval
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Retrieve all genres
 *     description: Returns a list of all genres, sorted by name.
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: A list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get genre by ID
 *     description: Returns a genre by its ID.
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the genre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A genre object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Genre not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Create a new genre
 *     description: Creates a new genre in the system.
 *     tags: [Genres]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       201:
 *         description: The created genre object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized - Authentication token is missing.
 *       500:
 *         description: Internal server error.
 */
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();

  res.send(genre);
});

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Update an existing genre
 *     description: Updates the name of a genre.
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the genre to update
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: The updated genre object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Validation error or invalid ID format.
 *       401:
 *         description: Unauthorized - Authentication token is missing.
 *       404:
 *         description: Genre not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id",
  [validateObjectId, auth, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  }
);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre
 *     description: Deletes a genre by its ID.
 *     tags: [Genres]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the genre to delete
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: The deleted genre object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Invalid ID format.
 *       401:
 *         description: Unauthorized - Authentication token is missing.
 *       403:
 *         description: Forbidden - Access denied.
 *       404:
 *         description: Genre not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
