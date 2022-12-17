const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator/check");

// GET all posts
router.get("/", isAuth, postController.getPosts);

// GET post detail
router.get("/:postId", isAuth, postController.getPostDetail);

// GET user posts
// router.get("/my-posts", isAuth,postController.getAuthorPost);

// GET add post page
// router.get("/add-post", isAuth, postController.getAddPost);

// POST add post
router.post("/", postController.postAddPost);
router.post("/itemsPerPage", postController.postItemsPerPage);
router.post("/sort", postController.postItemsPerPage);

// router.get("/posts/:postId/edit", isAuth, postController.getEditPost);

// POST edit post
router.post("/:postId",isAuth, postController.postEditPost);

module.exports = router;
