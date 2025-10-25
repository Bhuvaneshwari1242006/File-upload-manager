import express from "express";
import mongoose from "mongoose";
import upload from "../middleware/upload.js";

const router = express.Router();
let gfs;

const conn = mongoose.connection;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
});

// POST - Upload File
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.json({
    fileId: req.file.id,
    filename: req.file.filename,
    contentType: req.file.contentType,
    uploadDate: req.file.uploadDate
  });
});

// GET - List All Files
router.get("/", async (req, res) => {
  const files = await conn.db.collection("uploads.files").find().toArray();
  if (!files || files.length === 0) {
    return res.status(404).json({ message: "No files found" });
  }
  res.json(files);
});

// GET - Fetch a File by ID
router.get("/:id", (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    gfs.find({ _id: fileId }).toArray((err, files) => {
      if (!files || files.length === 0) return res.status(404).send("File not found");
      gfs.openDownloadStream(fileId).pipe(res);
    });
  } catch (err) {
    res.status(400).send("Invalid File ID");
  }
});

// DELETE - Remove a File by ID
router.delete("/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    await gfs.delete(fileId);
    res.send("File deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting file");
  }
});

export default router;