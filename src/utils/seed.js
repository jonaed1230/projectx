const db = require('./db');
// create user table which have id name email password role and created_at
const user = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), role VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
// create tasks table and set up foreign key for user id
const tasks = "CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description VARCHAR(255), user_id INT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)";
// create attendance table and set up foreign key for user id
const attendance = "CREATE TABLE IF NOT EXISTS attendance (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)";

const createTables = async () => {
  await db.query(user);
  await db.query(tasks);
  await db.query(attendance);
  console.log('Tables created');
};

createTables();
