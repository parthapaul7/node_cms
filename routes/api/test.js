const express = require("express");
const router = express.Router();
const test= require("../../controller/api/test.js");

// GET route after registering
router.get("/api/test", test.getData);

// GET route after registering




module.exports = router;