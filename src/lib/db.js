// lib/db.js
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost', // replace with your MariaDB host
  user: 'END', // replace with your MariaDB username
  password: '1234', // replace with your MariaDB password
  database: 'oneclick', // replace with your MariaDB database name
});
// const pool = mariadb.createPool({
//   host: "7lg.h.filess.io", // replace with your MariaDB host
//   user: "OneClick_theerootor", // replace with your MariaDB username
//   port: 3305,
//   password: "0130828ef3bf675d994cc6d1f2f4250c3b4a017f", // replace with your MariaDB password
//   database: "OneClick_theerootor", // replace with your MariaDB database name
//   connectTimeout: 30000, // 30 seconds
//   connectionLimit: 5,
//   ssl: false,

// });

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (err) {
    throw err;
  } finally {
    conn.release(); // release to pool
  }
}
