import mysql from "mysql2/promise";
import config from "../config/Database.js";

async function createConnection() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.db,
  });

  return connection;
}

async function getConnection() {
  const connection = await createConnection();

  connection.connect((error) => {
    if (error) {
      throw error;
    }
  });

  return connection;
}

const query = async (sql, params) => {
  const connection = await getConnection();

  await connection.query("USE ms_engage");

  const res = await connection.query(sql, params);

  return res[0];
};

// module.exports = { query };

export default query;
