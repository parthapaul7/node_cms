const express = require("express");
const router = express.Router();
const test = require("../../controller/api/test.js");

const path = require("path");
const multer = require("multer");

const baseImgUrl = process.env.BASE_IMG_URL;

// GET route after registering
router.get("/test", test.getData);

//uploading files
const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + file.originalname.replace(/\s/g, "")
    );
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async function (req, res, next) {
  try {
    res.status(200).json({
      status: "success",
      messege: "file uploaded successfully",
      file: baseImgUrl + req?.file?.filename,
    });
  } catch (error) {
    res.status(500).json({ status: "error", ...error });
  }
});

// get uploaded files
router.get("/:folder/:id", async function (req, res, next) {
  const rootdir = path.join(__dirname, "../../");
  res.sendFile(path.join(rootdir,req.params.folder, req.params.id));
});

module.exports = router;
