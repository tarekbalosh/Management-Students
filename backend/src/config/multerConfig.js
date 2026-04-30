const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB for production

// 1. Local Disk Storage (Dev/Local)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/temp');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 2. Cloudinary Storage (Production)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const studentId = req.studentId || req.body.studentId || 'general';
    return {
      folder: `student-management/students/${studentId}`,
      allowed_formats: ['jpg', 'png', 'pdf', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? cloudinaryStorage : diskStorage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
});

module.exports = { upload, cloudinary };
