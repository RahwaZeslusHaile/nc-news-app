const db = require('../db/connection');

exports.fetchAllUsers = () => {
  const queryString = 'SELECT username, name, avatar_url FROM users;';
  
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};