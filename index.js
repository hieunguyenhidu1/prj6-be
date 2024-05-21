const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");
// const CommentRouter = require("./routes/CommentRouter");


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Photos",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const upload = multer({
  storage: storage,
});

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/login", UserRouter);
app.use("/api/auth", AuthRouter);
app.use(
  "/api/upload",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  PhotoRouter,
);
app.use("/api/write", PhotoRouter);


app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
