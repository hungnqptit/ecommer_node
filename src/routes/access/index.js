"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//signIn
router.post("/shop/login", asyncHandler(accessController.login));
//signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));

//Authentication
router.use(authentication);
//logout
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
