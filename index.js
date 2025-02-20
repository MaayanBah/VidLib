const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome to VidLib
 *     description: The root endpoint of VidLib API.
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "VidLib"
 */
app.get("/", (req, res) => {
  res.send("VidLib");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
