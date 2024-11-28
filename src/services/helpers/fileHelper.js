const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".gif"
    ) {
      const error = new Error("File type is not supported");
      error.code = "UNSUPPORTED_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  },
});

module.exports = { upload };
