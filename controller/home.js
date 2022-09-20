const Asset = require("../models/asset");

exports.getFrontPage = async (req, res, next) => {
  const assets = await Asset.find();

  const advisory = assets.filter((asset) => asset.type === "advisory");
  console.log(advisory);

  return res.render("index", {
    pageTitle: "Front Page",
    advisory: advisory,
  });
};
