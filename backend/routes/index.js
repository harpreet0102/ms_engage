import express from "express";
// import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {
  Register,
  Login,
  getUsers,
  viewPosts,
  addPosts,
  getUser,
} from "../controllers/Users.js";

import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import multer from "multer";
import * as fs from "fs";

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("here----------", file, file.originalname, req.body.userName);
    var dir = "../frontend/public/labeled_images/" + req.body.userName;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // Uploads is the Upload_folder_name
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "1.jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 10000 * 10000 },
  //   fileFilter: function (req, file, cb) {
  //     // Set the filetypes, it is optional
  //     var filetypes = /jpeg|jpg|png/;
  //     var mimetype = filetypes.test(file.mimetype);

  //     var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //     if (mimetype && extname) {
  //       return cb(null, true);
  //     }
  //     cb(
  //       "Error: File upload only supports the " +
  //         "following filetypes - " +
  //         filetypes
  //     );
  //   },
});

router.get("/users", verifyToken, getUsers);
router.get("/user", verifyToken, getUser);

router.post("/users", upload.single("file"), Register);
router.post("/login", Login);
// router.get("/token", refreshToken);
router.get("/posts", verifyToken, viewPosts);
router.post("/posts", verifyToken, addPosts);

// router.delete('/logout', Logout);

export default router;
