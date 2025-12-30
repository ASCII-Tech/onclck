import mariadb from "mariadb";

// Determine if the environment is 'production' or 'development'
const isProduction = process.env.NODE_ENV === "development";

const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Remote host if in production, local host otherwise
  user: process.env.DB_USER, // Remote user if in production, local user otherwise
  port: process.env.DB_PORT, // Remote port (3305) vs default MariaDB port (3306)
  password: process.env.DB_PASSWORD, // Remote password if in production, local password otherwise
  database: process.env.DB_NAME, // Remote database if in production, local database otherwise
  connectTimeout: 10000, // Timeout: 30 seconds for remote, 10 seconds for local
  connectionLimit: 1, // Remote limit of 1 connection, local can handle more
  // ssl: isProduction ? false : false, // SSL config, modify as necessary
});

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.release(); // release to pool
    }
  }
}
