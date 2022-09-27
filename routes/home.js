const express = require("express");
const router = express.Router();
const homeController= require("../controller/home");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator/check");
const User = require("../models/user");

// GET for front page
router.get("/", homeController.getFrontPage);
// auth is already added in the controller


module.exports = router;