const db = require("../connection")
const format = require("pg-format");
const { createLookupObject } = require("./utils")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => db.query("DROP TABLE IF EXISTS articles;"))
    .then(() => db.query("DROP TABLE IF EXISTS users;"))
    .then(() => db.query("DROP TABLE IF EXISTS topics;"))
    .then(() => createTopics())
    .then(() => createUsers())
    .then(() => createArticles())
    .then(() => createComments())
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const sqlString = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,
        formattedTopics
      );
      return db.query(sqlString);
    })
    .then(()=>{
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      })
      const sqlString = format(`INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`, formattedUsers);
      return db.query(sqlString);
    })
    .then(()=>{
      const formattedArticles = articleData.map((article) =>
        [article.title,article.topic, article.author,article.body,new Date(article.created_at).toISOString(), article.votes, article.article_img_url
      ]);
      const sqlString = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(sqlString);
})
    
.then(() => {
 
  const formattedComments = commentData.map((comment) => [
    comment.article_id,  
    comment.body,
    comment.votes,
    comment.author, 
    new Date(comment.created_at).toISOString() 
  ]);
  const sqlString = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
    formattedComments
  );
  return db.query(sqlString);
});








};


function createTopics() {
  return db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR(255),
    img_url VARCHAR(1000)
  );`);
}

function createUsers() {
  return db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR(1000)
  );`);
}

function createArticles() {
  return db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR REFERENCES topics(slug),
    author VARCHAR REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
  );`);
}

function createComments() {
  return db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
}

module.exports = seed;
