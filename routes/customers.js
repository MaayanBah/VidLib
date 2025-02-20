const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Customer, validateCustomer } = require("../models/customer");
const validate = require("../middleware/validate");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management and retrieval
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     description: Returns a list of all customers.
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     description: Returns a customer by its ID.
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the customer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A customer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new customer in the system.
 *     tags: [Customers]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The created customer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad request - validation failed
 *       401:
 *         description: Access denied - missing token
 *       403:
 *         description: Forbidden - admin rights required
 *       500:
 *         description: Internal server error
 */
router.post("/", validate(validateCustomer), async (req, res) => {
  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  await customer.save();

  res.send(customer);
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     description: Updates the name, phone, and isGold status of a customer.
 *     tags: [Customers]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the customer to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The updated customer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid ID or validation failed
 *       401:
 *         description: Access denied - missing token
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", validate(validateCustomer), auth, async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Deletes a customer by its ID.
 *     tags: [Customers]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the customer to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted customer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Access denied - missing token
 *       403:
 *         description: Forbidden - admin rights required
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
