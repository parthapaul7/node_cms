const User = require('../models/user');

module.exports= async (req, res, next) => {
  const user = await User.findById(req.session.userId) 
  if (!user.isAdmin) {
    var err = new Error("Not authorized! Go back!");
    err.status = 400;
    return res.render("error", {
      pageTitle: "Access Denied",
      errorStatus: err.status,
      errMessage: err
    });
  }
  return next();
}