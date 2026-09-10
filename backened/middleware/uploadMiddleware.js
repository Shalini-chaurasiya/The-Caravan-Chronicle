import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// Create upload folder
// ==========================================
const uploadDir = "uploads/complaints";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


// ==========================================
// Storage
// ==========================================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },

});


// ==========================================
// File filter
// ==========================================
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(
      new Error("Only JPG, JPEG and PNG images are allowed."),
      false
    );

  }

};


// ==========================================
// Multer
// ==========================================
const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});


export default upload;