const Asset = require("../models/asset");

exports.getFrontPage = async (req, res, next) => {

  if(!req.session.userId){
    return res.redirect("/login");
  }

  const assets = await Asset.find();

  const advisory = assets.filter((asset) => asset.type === "advisory");
  const photoGallery = assets.filter((asset) => asset.type === "photo_gallery");
  const timeline= assets.filter((asset) => asset.type === "timeline");
  const invited= assets.filter((asset) => asset.type === "invited");


  return res.render("index", {
    pageTitle: "Front Page",
    advisory: advisory,
    photoGallery: photoGallery,
    timeline: timeline[0],
    invited: invited,
  });
};
