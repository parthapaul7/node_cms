const express = require("express");
const router = express.Router();
const profileCtrl = require("../controller/profile.js");
const isAuth = require("../middleware/isAuth");
const  isAdmin = require("../middleware/isAdmin");
const { body } = require("express-validator/check");
const User = require("../models/user");

// GET route after registering
router.get("/users", isAuth,isAdmin, profileCtrl.getAllUsers);

// GET route after registering
router.get("/account", isAuth, profileCtrl.getAccount);

// GET route PROFILE
router.get("/user/:userId", isAuth,isAdmin, profileCtrl.getUser);

// GET route PROFILE EDIT PAGE
router.get("/user/:userId/edit", isAuth,isAdmin, profileCtrl.getUserEdit);

// POST route PROFILE EDIT PAGE
router.post(
  "/profile-edit",
  isAuth,
  [
    body("email", "Invalid email")
      .isEmail()
      .not().isEmpty().withMessage("Required"),
    body("username")
      .not().isEmpty().withMessage("Required")
  ],
  profileCtrl.postUserEdit
);

// DELETE route PROFILE EDIT PAGE
// router.delete("/user-delete/:userId", isAuth,isAdmin, profileCtrl.deleteUser);

module.exports = router;
