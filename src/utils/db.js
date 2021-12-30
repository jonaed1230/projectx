const mysql = require('mysql2/promise');

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: '194.233.81.193',
    user: 'jonaedbd_jonaedbd',
    password: 'Someone@1234',
    database: 'jonaedbd_university_project',
  });
  const [results, errors] = await connection.execute(sql, params);
  return results;
}

module.exports = {
  query
};