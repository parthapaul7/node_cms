const Asset = require("../../models/asset");
const baseUrl = process.env.BASE_UPLOADS_URL;
const path = require("path");
const multer = require("multer");
const { errorMonitor } = require("events");

exports.getAssetFilesForm = (req, res, next) => {
  let message = req.flash("notification");

  return res.render("content/asset_files", {
    pageTitle: "Add files",
    oldInput: {
      file: "",
      type: "",
      name: "",
      institution: "",
      extraFields: "",
    },
    errMessage: message.length > 0 ? message[0] : null,
    errFields: {
      errFile: "",
      errType: "",
      errName: "",
      errInsti: "",
    },
  });
};

//uploading files
const storage = multer.diskStorage({
  destination: "asset_files/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname +
        "_" +
        uniqueSuffix +
        "_" +
        file.originalname.replace(/\s/g, "")
    );
  },
});

const upload = multer({ storage: storage }).single("file");

exports.postAssetFiles = async (req, res, next) => {
  let file, file_name;

  upload(req, res, async function (err) {
    file = baseUrl + req.file.filename;
    file_name = req.file.originalname;

    if (err) {
      res.status(500).json({ status: "error", ...err });
    }

    const type = req.body.type,
      name = req.body.name,
      institution = req.body.institution;

    let extraFields;
    if (req.body.extraFields) {
      try {
        extraFields = JSON.parse(req.body.extraFields);
      } catch (error) {
        return res.status(500).json({ status: "error", message: "Invalid JSON", ...error });
      }
    }

    const asset = new Asset({
      file_name: file_name,
      name: name,
      file: file,
      type: type || "",
      institution: institution || "",
      extraFields: extraFields || {},
    });
    try {
      await asset.save();
      res.status(200).json({
        status: "success",
        messege: "file uploaded successfully",
        name: name,
        file: file,
        institution: institution,
        extraFields: extraFields,
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
};

exports.getAssetList = async (req, res, next) => {
  try {
    let assets;
    
    if(req.params.type === "invited"){
       assets = await Asset.find({
      type: req.params.type,
      ...req.query,
    }).sort({ name: 1 });
    }
    else{
      assets = await Asset.find({
        type: req.params.type,
        ...req.query,
      }).sort({ index: 1 });
    }  
    res.status(200).json({
      status: "success",
      data: assets,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditAssetFilesForm = async (req, res, next) => {
  try {
    const post = await Asset.findOne({
      _id: req.params.id,
    });

    return res.render("content/edit_asset", {
      pageTitle: "Edit Asset",
      post: post,
      errFields: {
        errTitle: "",
        errDesc: "",
      },
      oldInput: {
        name: post.name,
        type: post.type,
        institution: post.institution,
        extraFields: JSON.stringify(post.extraFields,null,2),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.postEditAssetFiles = (req, res, next) => {
  let file, file_name;
  upload(req, res, async function (err) {
    if (err) {
      res.status(500).json({ status: "error", ...err });
    }

    let extraFields
    try {
      extraFields = JSON.parse(req.body.extraFields);
    }
    catch (error) {
      return res.status(500).json({ status: "error", message: "Invalid JSON", ...error });
    }

    const data = {
      name: req.body.name,
      institution: req.body.institution,
      extraFields: extraFields,
    };

    if (req.file) {
      file = baseUrl + req.file.filename;
      file_name = req.file.originalname;
      data.file = file;
      data.file_name = file_name;
    }

    try {
      const updatedRes = await Asset.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ...data,
          },
        }
      );
      res.status(200).json({
        status: "success",
        data: updatedRes,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        data: err,
      });
    }
  });
};
