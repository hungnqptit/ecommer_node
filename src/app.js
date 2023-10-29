require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// inite db
require("./dbs/init.mongodb");
const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
// inite router
app.use(require("./routes/index"));
// handle error

module.exports = app;
