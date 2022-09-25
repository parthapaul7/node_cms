const Post = require("../models/abstract");
const ITEMS_PER_PAGE = 20;
let totalItems, page;
const path = require("path");
const multer = require("multer");

exports.getPosts = async (req, res, next) => {
  var message = req.flash("notification");
  page = +req.query.page || 1;
  const sortBy = req.query.sortBy || "author";

  try {
    let postsLength, isAbsBlocked, products;
    if (!req.query.search) {
      postsLength = await Post.find({}).countDocuments();
      isAbsBlocked = await Post.find({ abstractId: "default" });
      products = await Post.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort({ [sortBy]: 1 });
    } else {
      postsLength = await Post.find({
        $text: { $search: `\"${req.query.search}\"` },
      }).countDocuments();
      isAbsBlocked = await Post.find({ abstractId: "default" });
      products = await Post.find({
        $text: { $search: `\"${req.query.search}\"` },
      })
      .sort({ [sortBy]: 1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    }

    totalItems = postsLength;

    res.render("post/post-list", {
      pageTitle: "Abstracts",
      posts: products,
      isAbsBlocked:
        isAbsBlocked.length > 0 ? "Abstract submission blocked" : "",
      errMessage: message.length > 0 ? message[0] : null,
      itemsPerPage: ITEMS_PER_PAGE,
      totalItems: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      search: req.query.search,
      isSortedByDate: req.query.sortBy === "createdAt" ? true : false,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getPostDetail = async (req, res, next) => {
  var message = req.flash("notification");
  try {
    const post = (await Post.find({ _id: req.params.postId }))[0];
    const temp = new Date(post.createdAt);
    const submissionDate =
      temp.toLocaleDateString() + " | " + temp.toLocaleTimeString();
    console.log(submissionDate);
    res.render("post/post-detail", {
      pageTitle: post.title,
      post: post,
      submissionDate,
      errMessage: message.length > 0 ? message[0] : null,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// exports.getAddPost = (req, res, next) => {
//   let message = req.flash("notification");

//   return res.render("post/add-post", {
//     pageTitle: "Add Post",
//     oldInput: {
//       title: '',
//       description: ''
//     },
//     errMessage: message.length > 0 ? message[0] : null,
//     errFields: {
//       errTitle:  '',
//       errDesc: ''
//     }
//   });
// };

// upload files

const storage = multer.diskStorage({
  destination: "abstracts/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname +
        "_" +
        uniqueSuffix +
        "_" +
        file.originalname.substring(file.originalname.length-10).replace(/\s/g, "")
    );
  },
});

const upload = multer({ storage: storage }).single("abstract");

exports.postAddPost = (req, res, next) => {
  upload(req, res, async function (err) {
    // console.log(req.file, "file");
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "File not uploaded" });
    }
    if (req.file.size > 10000000) {
      return res
        .status(500)
        .json({ status: "error", message: "File size too large" });
    }

    const file_link =
      process.env.BASE_FILE_URL_NEW + "abstracts/" + req.file.filename;

    const post = new Post({
      ...req.body,
      fileName: file_link,
    });

    try {
      const result = await post.save();
      res.json(result);
      if (result) {
        let formattedNumber = result.index.toLocaleString("en-US", {
          minimumIntegerDigits: 5,
          useGrouping: false,
        });
        const field = result.theme.replace(/[^A-Z]/g, "");
        const absId = field + formattedNumber.toString();

        try {
          await Post.updateOne({ _id: result._id }, { abstractId: absId });
          const response = (await Post.find({ _id: result._id }))[0];
          res
            .status(200)
            .json({ status: "success", message: "Post added", ...response._doc });
        } catch (error) {
          res.status(500).json({ status: "error", message: error });
        }

      }
      res
        .status(400)
        .json({ status: "error", message: "something went wrong" });
    } catch (err) {
      res
        .status(500)
        .json({ status: "error", message: "Abstract not added", ...err });
    }
  });
};

exports.getEditPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      author: { userId: req.session.userId },
    });
    return res.render("post/edit-post", {
      pageTitle: "Edit post",
      post: post,
      errFields: {
        errTitle: "",
        errDesc: "",
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.postEditPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.postId });
  if (!post)
    return res.status(404).json({ status: "error", message: "Post not found" });

  post.title = req.body.title;
  post.description = req.body.description;
  post.file = req.body.file;

  try {
    const result = await post.save();
    if (result) {
      // req.flash("notification", result.title + " edited successfully");
      // res.redirect("/posts/" + req.body.postId);
      res
        .status(200)
        .json({ status: "success", message: "Post updated", ...result._doc });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "error", message: "Post not updated", ...err });
  }
};

//////////////////// for author stuff ////////////////////////
exports.getAuthorPost = async (req, res, next) => {
  if (!req.session.userId) {
    var error = new Error("Access Denied");
    error.status = 402;
    next(error);
  }

  var message = req.flash("notification");
  page = +req.query.page || 1;

  try {
    const postCount = await Post.find().countDocuments();
    const posts = await Post.find({ author: { userId: req.session.userId } })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    totalItems = postCount;
    return res.render("post/post-list", {
      pageTitle: "Post",
      posts: posts,
      errMessage: message.length > 0 ? message[0] : null,
      totalItems: totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
