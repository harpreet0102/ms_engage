import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import query from "../db/index.js";
import config from "../config/Database.js";

export const getUsers = async (req, res) => {
  try {
    const users = await query(`SELECT * FROM users`);
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const viewPosts = async (req, res) => {
  try {
    const posts = await query(`SELECT * FROM posts`);
    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};
export const Register = async (req, res) => {
  console.log("req.body", req.body);
  const { userName, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const registerUserQuery = `
    INSERT INTO users (userName, email, password)
    VALUES ?
    `;

    const response = await query(registerUserQuery, [
      [[userName, email, hashPassword]],
    ]);

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  console.log("here----------");
  try {
    const { userName, password } = req.body;

    const getLoginUserQuery = `
        SELECT userId, email, userName,password
        FROM users
        WHERE userName = ?
        `;
    const getLoginUserQueryParams = [userName];
    const user = await query(getLoginUserQuery, getLoginUserQueryParams);
    console.log("user", user, userName, password);

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].userId;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, userName, email },
      config.secrets.accessTokenSecret,
      {
        expiresIn: "20s",
      }
    );
    console.log("accessToken", accessToken);
    const refreshToken = jwt.sign(
      { userId, userName, email },
      config.secrets.refreshTokenSecret,
      {
        expiresIn: "1d",
      }
    );
    console.log("refreshToken", refreshToken);

    await query(
      `
    UPDATE users 
    SET refresh_token = ?
    WHERE userId = ?
    `,
      [refreshToken, userId]
    );

    res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log("res", res.cookie.refreshToken);
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not valid!" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
