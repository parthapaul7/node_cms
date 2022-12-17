const express = require("express");
const router = express.Router();
const registrationController= require("../controller/registration");
const isAuth = require("../middleware/isAuth");

// GET all posts
router.get("/", isAuth, registrationController.getRegisrationList);

// GET post detail
router.get("/:registerId", isAuth, registrationController.getRegstrationDetail);

router.post("/", registrationController.postAddRegisteration);

module.exports = router;