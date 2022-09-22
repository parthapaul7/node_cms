const Asset = require("../../models/asset");
const baseUrl= process.env.BASE_UPLOADS_URL;
const path = require("path");
const multer = require("multer");
const { errorMonitor } = require("events");

exports.getAssetFilesForm= (req, res, next) => {
  let message = req.flash("notification");

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
      res.status(500).json({ status: "error", ...err });
    }


    const type = req.body.type,
          name = req.body.name,
          institution = req.body.institution;

    // console.log(file_name,type,file);
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
    const assets = await Asset.find({type: req.params.type,...req.query}).sort({index: 1});

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
      oldInput:{
        name: post.name,
        type: post.type,
        institution: post.institution,
      }
    });
  } catch (err) {
    return next(err);
  }
}

exports.postEditAssetFiles = async (req, res, next) => {
  const name= req.body.name;
  const type= req.body.type;
  const id = req.body.id;

  res.status(200).json({
    status: "success",
    messege: "file uploaded successfully",
    name: name,
    type: type,
    id: id,
  });
  // if (!errors.isEmpty()) {
  //   return res.status(422).render("content/edit_asset", {
  //     pageTitle: "Edit Asset",
  //     post: {
  //       name,
  //       type,
  //       _id: id,
  //     },
  //     errFields: {
  //       errTitle: errors.array()[0].msg,
  //       errDesc: errors.array()[1].msg,
  //     },
  //   });
  // }
  // try {
  //   const post = await Asset.findOne({
  //     _id: id,
  //   });
  //   post.name= name;
  //   post.type= type;
  //   await post.save();
  //   res.redirect("/asset_list");
  // } catch (err) {
  //   return next(err);
  // }
}