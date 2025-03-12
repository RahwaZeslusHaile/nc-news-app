
const db =require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    const queryString = `SELECT comment_id, article_id, body, votes, author, created_at 
                         FROM comments 
                         WHERE article_id = $1 
                         ORDER BY created_at DESC`;

    return db.query(queryString, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Comments Not Found' });
        }
        return rows;
    });
};




exports.addCommentForArticle = (article_id, username, body) => {
    if (!article_id || !username || !body) {
      return Promise.reject({
        status: 400,
        msg: 'Missing required fields: article_id, username, and body',
      });
    }
  
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then(({ rows }) => {
       
        if (rows.length === 0) {
          
          return Promise.reject({status: 404,msg: 'Article not found',
          });
        }
  
        return db.query(
          `INSERT INTO comments (article_id, author, body)
           VALUES ($1, $2, $3)
           RETURNING *;`,
          [article_id, username, body]
        );
      })
      .then(({ rows }) => {
        const newComment = rows[0];  
        return newComment;
      });
  };
  