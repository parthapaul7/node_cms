const Registration = require("../models/registration");
const multer = require("multer");

exports.getRegisrationList = async (req, res, next) => {
    console.log("getRegisrationList")
  try {
    const registration = await Registration.find();
    res.render("registration/registration-list", {
      pageTitle: "Registration",
      registration: registration,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getRegstrationDetail = async (req, res, next) => {
  const registerId = req.params.registerId;
  try {
    const registration = await Registration.findById(registerId);
    res.render("registration/registration-detail", {
      pageTitle: "Registration",
      registration: registration,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const storage = multer.diskStorage({
  destination: "registrations/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    // console.log(req.body, "userId");
    cb(
      null,
      file.fieldname +
        "_" +
        uniqueSuffix +
        "_" +
        file.originalname
          .substring(file.originalname.length - 10)
          .replace(/\s/g, "")
    );
  },
});

const upload = multer({ storage: storage }).single("recipt");

exports.postAddRegisteration = async (req, res, next) => {
  upload(req, res, async function (err) {
    console.log(req.file, "file")
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "File not uploaded" });
    }

    if (req.file.size > 5000000) {
      return res
        .status(500)
        .json({
          status: "error",
          message: "File size too large need less than 5 MB",
        });
    }

    const file_link =
      process.env.BASE_FILE_URL_NEW + "registrations/" + req.file.filename;

    const register= new Registration({
      ...req.body,
      fileName: file_link,
    });

    try {
      const result = await register.save();
      if(result){
       return res.status(200).json({ status: "success", message: "Registration added successfully" });
      }

      return res.status(500).json({ status: "error", message: "Registration not added" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", message: "Registration not added", error: error });
    }
  });
};
