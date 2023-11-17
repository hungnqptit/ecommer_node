"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");

const router = express.Router();

//Authentication
router.use(authentication);
//logout
router.post("", asyncHandler(productController.createProduct));

module.exports = router;
