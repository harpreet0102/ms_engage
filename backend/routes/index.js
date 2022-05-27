import express from "express";
import {
  Register,
  Login,
  getUsers,
  viewPosts,
  addPosts,
  getUser,
} from "../controllers/Users.js";

import { verifyToken } from "../middleware/VerifyToken.js";
import multer from "multer";
import * as fs from "fs";

const router = express.Router();

//making a directory with userName as its name and storing the uploaded image of the user  in that directory with name as  "1.jpg"

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "build/labeled_images/" + req.body.userName;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "1.jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 10000 * 10000 },
});

router.get("/api/users", verifyToken, getUsers);
router.get("/api/user", verifyToken, getUser);

router.post("/api/users", upload.single("file"), Register);
router.post("/api/login", Login);
router.get("/api/posts", verifyToken, viewPosts);
router.post("/api/posts", verifyToken, addPosts);

export default router;
