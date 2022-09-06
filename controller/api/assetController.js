const Asset = require("../../models/asset");
const baseUrl= process.env.BASE_UPLOADS_URL;
const path = require("path");
const multer = require("multer");
const { errorMonitor } = require("events");

exports.getAssetFilesForm= (req, res, next) => {
  let message = req.flash("notification");

  console.log("get asset files form");
  return res.render("content/asset_files", {
    pageTitle: "Add files",
    oldInput: {
      file: '',
      type: '',
      name: '',
      institution: '',
    },
    errMessage: message.length > 0 ? message[0] : null,
    errFields: {
      errFile:  '',
      errType: '',
      errName: '',
      errInsti: ''
    }
  })

};

//uploading files
const storage = multer.diskStorage({
  destination: "asset_files/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname+"_"+ uniqueSuffix+"_"+file.originalname.replace(/\s/g, "")
    );
  },
});

const upload = multer({ storage: storage }).single("file");

exports.postAssetFiles = async (req, res, next) => {
  let file,file_name;

  upload(req, res, async function (err) {
    file = baseUrl+req.file.filename;
    file_name = req.file.originalname;

    if(err){
      console.log(err);
      res.status(500).json({ status: "error", ...err });
    }


    const type = req.body.type,
          name = req.body.name,
          institution = req.body.institution;

    console.log(file_name,type,file);
    const asset = new Asset({
      file_name: file_name ,
      name: name,
      file: file,
      type: type || "",
      institution:  institution|| "",
    });
    try {
      await asset.save();
        res.status(200).json({
          status: "success",
          messege: "file uploaded successfully",
          name: name,
          file: file,
          institution: institution,
        });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }) 
}

exports.getAssetList = async (req, res, next) => {
  try {
    const assets = await Asset.find();
    res.status(200).json({
      status: "success",
      data: assets,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}