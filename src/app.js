const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// inite db

// inite router
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome",
  });
});

// handle error

module.exports = app;
