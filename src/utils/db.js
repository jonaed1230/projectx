const mysql = require('mysql2/promise');

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: '168.119.4.47',
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