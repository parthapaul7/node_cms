const Registration = require("../models/registration");
const multer = require("multer");
const registration = require("../models/registration");
let totalItems, page;

exports.getRegisrationList = async (req, res, next) => {
  const tempPage = Number(req.cookies.itemsPerPage);
  const ITEMS_PER_PAGE = tempPage || 20;
  page = +req.query.page || 1;

  let sortBy = req.cookies.sortBy || "name";
  if (req.cookies.sortBy === "author") {
    sortBy = "name";
  }

  try {
    let registration, isAbsBlocked, registrationsLength;
    if (!req.query.search) {
      registrationsLength = await Registration.find({}).countDocuments();
      // isAbsBlocked = await Post.find({ abstractId: "default" });
      registration = await Registration.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ [sortBy]: 1 });
    } else {
      registrationsLength = await Registration.find({
        $text: { $search: `\"${req.query.search}\"` },
      }).countDocuments();

      // isAbsBlocked = await Post.find({ abstractId: "default" });
      registration = await Registration.find({
        $text: { $search: `\"${req.query.search}\"` },
      })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ [sortBy]: 1 });
    }

    res.render("registration/registration-list", {
      pageTitle: "Registration",
      posts: registration,
      itemsPerPage: ITEMS_PER_PAGE,
      totalItems: registrationsLength,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < registrationsLength,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(registrationsLength / ITEMS_PER_PAGE),
      search: req.query.search,
      isSortedByDate: sortBy === "createdAt" ? true : false,
      errMessage: null,
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
    const registration = await Registration.findOne({ _id: registerId });

    const date = new Date(registration.createdAt);
    const fDate=  new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(date)

    res.render("registration/registration-detail", {
      pageTitle: "Registration",
      post: registration,
      submissionDate: fDate,
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
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "File not uploaded" });
    }

    if (req.file.size > 5000000) {
      return res.status(500).json({
        status: "error",
        message: "File size too large need less than 5 MB",
      });
    }

    const file_link =
      process.env.BASE_FILE_URL_NEW + "registrations/" + req.file.filename;

    const register = new Registration({
      ...req.body,
      fileName: file_link,
    });

    try {
      const result = await register.save();
      if (result) {
        return res
          .status(200)
          .json({
            status: "success",
            message: "Registration added successfully",
            data: result,
          });
      }

      return res
        .status(500)
        .json({ status: "error", message: "Registration not added" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          status: "error",
          message: "Registration not added",
          error: error,
        });
    }
  });
};
