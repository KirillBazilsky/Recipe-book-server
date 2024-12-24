import multer from "multer";

const storageConfig = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, process.env.UPLOAD_DIR || "/tmp/uploads");
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 20 * 1024 * 1024 }, //20Mb
});

export const uploadMiddleware = upload.single("image");
