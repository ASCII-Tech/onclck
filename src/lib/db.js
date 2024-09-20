// lib/db.js
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost', // replace with your MariaDB host
  user: 'END', // replace with your MariaDB username
  password: '1234', // replace with your MariaDB password
  database: 'oneclick', // replace with your MariaDB database name
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
    if (conn) conn.release(); // release to pool
  }
}
