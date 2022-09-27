const Asset = require("../models/asset");

exports.getFrontPage = async (req, res, next) => {

  if(!req.session.userId){
    return res.redirect("/login");
  }

  const assets = await Asset.find();

  const advisory = assets.filter((asset) => asset.type === "advisory");

  return res.render("index", {
    pageTitle: "Front Page",
    advisory: advisory,
  });
};
