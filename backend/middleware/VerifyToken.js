import jwt from "jsonwebtoken";
import config from "../config/Database.js";

export const verifyToken = (req, res, next) => {
  console.log("request", req.headers.authorization);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.secrets.accessTokenSecret, (err, decoded) => {
    console.log("err", err, decoded);
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    next();
  });
};
