const {pool} = require('../config/db');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');

// User queries
async function createUser(username, password, email) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = 'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING user_id, username';
  const values = [username, hashedPassword, email];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserById(id) {
  const query = 'SELECT user_id, username FROM users WHERE user_id = $1';
  const values = [id];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function comparePassword(candidatePassword, hash) {
  return bcrypt.compare(candidatePassword, hash);
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  comparePassword,
};