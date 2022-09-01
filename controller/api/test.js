const ITEMS_PER_PAGE = 50;

// GET route after registering - Account page
exports.getData= async(req, res, next) => {
  try{
    return res.send({
      message: "Hello World"
    });
  } catch(err) {
    return next(err);
  }
};