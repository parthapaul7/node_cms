const express = require("express");
const router = express.Router();
const assetController = require("../../controller/api/assetController");
const path = require("path");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");


// GET route after registering




router.post("/asset_files",isAuth,isAdmin, assetController.postAssetFiles);

// get to asset-files
router.get("/asset_files", isAuth,isAdmin,assetController.getAssetFilesForm);

// get uploaded files
router.get("/api/asset_files/:id", async function (req, res, next) {
  const rootdir = path.join(__dirname, "../../");
  res.sendFile(path.join(rootdir, "asset_files", req.params.id));
});

module.exports = router;