import jwt from "jsonwebtoken";
import config from "../config/Database.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken", refreshToken);
    if (!refreshToken) return res.sendStatus(401);
    const user = await query(
      `SELECT refreshToken FROM users WHERE refresh_token = ?`,
      [refreshToken]
    );

    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      config.secrets.refreshTokenSecret,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          config.secrets.accessTokenSecret,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
