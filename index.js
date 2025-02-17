const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

app.get("/", (req, res) => {
  res.send("VidLib");
});

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
