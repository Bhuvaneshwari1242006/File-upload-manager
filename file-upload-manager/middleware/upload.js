import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/file_manager",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "uploads", // Collection name
      filename: '${Date.now()}-${file.originalname}',
    };
  }
});
const upload = multer({ storage });
export default upload;