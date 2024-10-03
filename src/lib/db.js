import mariadb from 'mariadb';

// Determine if the environment is 'production' or 'development'
const isProduction = process.env.NODE_ENV === 'production';

const pool = mariadb.createPool({
  host: isProduction ? '7lg.h.filess.io' : 'localhost', // Remote host if in production, local host otherwise
  user: isProduction ? 'OneClick_theerootor' : 'END', // Remote user if in production, local user otherwise
  port: isProduction ? 3305 : 3306, // Remote port (3305) vs default MariaDB port (3306)
  password: isProduction
    ? '0130828ef3bf675d994cc6d1f2f4250c3b4a017f'
    : '1234', // Remote password if in production, local password otherwise
  database: isProduction ? 'OneClick_theerootor' : 'oneclick', // Remote database if in production, local database otherwise
  connectTimeout: isProduction ? 30000 : 10000, // Timeout: 30 seconds for remote, 10 seconds for local
  connectionLimit: isProduction ? 1 : 5, // Remote limit of 1 connection, local can handle more
  ssl: isProduction ? false : false, // SSL config, modify as necessary
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
