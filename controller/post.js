const Post = require("../models/post");
const ITEMS_PER_PAGE = 50;
let totalItems, page;

exports.getPosts = async(req, res, next) => {
  var message = req.flash("notification");
      page = +req.query.page || 1;
    
    try {
      const posts = await Post.find();
      const numProducts = await Post.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
  
        totalItems = numProducts;
  
        res.render("post/post-list", {
          pageTitle: "Post",
          posts: posts,
          errMessage: message.length > 0 ? message[0] : null,
          itemsPerPage: ITEMS_PER_PAGE,
          totalItems: totalItems,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });     
      
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
};


exports.getPostDetail = async(req, res, next) => {
  var message = req.flash("notification");
  try {
    console.log(req.params.postId, "post id");
    const post = (await Post.find({_id:req.params.postId}))[0];
    console.log(post, "post");
    res.render("post/post-detail", {
      pageTitle: post.title,
      post: post,
      errMessage: message.length > 0 ? message[0] : null
    });
  } catch(err) {
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

exports.postAddPost = async(req, res, next) => {
  const author = req.session.userId,
        title = req.body.title,
        description = req.body.description,
        file = req.body.file;

  const post = new Post({
    title: title,
    description: description,
    file: file,
    author: {
      userId: author
    }
  });

  try {
    const result = await post.save();
    if(result) {
      res.status(200).json({status:"success",message: 'Post added',...result._doc});
    }
    res.status(400).json({status:"error",message: 'something went wrong'});
  } catch(err) {
    res.status(500).json({status:"error",message: 'Post not added',...err});
  }
};

exports.getEditPost = async (req, res, next) => {
  try{
    const post = await Post.findOne({
      _id: req.params.postId,
      author: { userId: req.session.userId }
    })
    return res.render("post/edit-post", {
      pageTitle: "Edit post",
      post: post,
      errFields: {
        errTitle: '',
        errDesc: '',
      }
    });
  } catch(err) {
    return next(err);
  }
};

exports.postEditPost = async (req, res, next) => {


  const post = await Post.findOne({ _id: req.params.postId});
  if (!post) return res.status(404).json({status:"error",message: 'Post not found'});

  console.log(post, "post");
  post.title = req.body.title;
  post.description = req.body.description;
  post.file = req.body.file;

  try {
    const result = await post.save();
    if(result) {
      // req.flash("notification", result.title + " edited successfully");
      // res.redirect("/posts/" + req.body.postId);
      res.status(200).json({status:"success",message: 'Post updated',...result._doc});
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({status:"error",message: 'Post not updated',...err});
  }
};




//////////////////// for author stuff ////////////////////////
exports.getAuthorPost = async(req, res, next) => {
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
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  } catch(err){
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
