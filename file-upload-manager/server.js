import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import cors from "cors";
import routes from "./routes/fileRoutes.js";
const app = express();
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());
const mongoURI = "mongodb://localhost:27017/file_manager";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfully");
});
app.use("/api/files", routes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));