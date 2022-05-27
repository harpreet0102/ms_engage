import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

import config from "../config/Database.js";

export const getUsers = async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);
    res.json(users[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users WHERE userId = ?`, [
      req.userId,
    ]);

    res.json(users[0]);
  } catch (error) {
    console.log(error);
  }
};

export const viewPosts = async (req, res) => {
  try {
    const posts = await db.query(`
    SELECT p.*,u.*
    FROM posts p
    JOIN users u on p.createdBy = u.userId
    `);
    res.json(posts[0]);
  } catch (error) {
    console.log(error);
  }
};

export const addPosts = async (req, res) => {
  const { description } = req.body;
  const userId = req.userId;
  try {
    const addPostQuery = `
    INSERT INTO posts (description, createdBy)
    VALUES ?
    `;

    const response = await db.query(addPostQuery, [[[description, userId]]]);

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { userName, email, password } = req.body;
  const checkIfUserExist = `SELECT * FROM users WHERE userName = ?`;
  const checkValues = [userName];
  const checkIfUserExistResponse = await db.query(
    checkIfUserExist,
    checkValues
  );
  if (checkIfUserExistResponse[0].length > 0) {
    const message = "UserName already exists";
    res.status(201).json({ success: false, message });
  } else {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      const registerUserQuery = `
    INSERT INTO users (userName, email, password)
    VALUES ?
    `;

      const response = await db.query(registerUserQuery, [
        [[userName, email, hashPassword]],
      ]);

      res.status(201).json({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
};

export const Login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const getLoginUserQuery = `
        SELECT userId, email, userName,password
        FROM users
        WHERE userName = ?
        `;
    const getLoginUserQueryParams = [userName];
    const user = await db.query(getLoginUserQuery, getLoginUserQueryParams);

    const match = await bcrypt.compare(password, user[0][0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0][0].userId;
    const email = user[0][0].email;
    const accessToken = jwt.sign(
      { userId, userName, email },
      config.secrets.accessTokenSecret,
      {
        expiresIn: "1d",
      }
    );

    res.json({ success: true, accessToken });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ msg: "Email not valid!" });
  }
};
