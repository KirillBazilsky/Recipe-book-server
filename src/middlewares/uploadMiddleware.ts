import multer from "multer";


const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 20 * 1024 * 1024 }, //20Mb
});

export const uploadMiddleware = upload.single("image"); 
