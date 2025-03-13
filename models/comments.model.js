
const db =require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(queryString, [article_id])
      .then(({ rows }) => {
          if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: 'Article Not Found' });
          }
 const commentQueryString = `SELECT comment_id, article_id, body, votes, author, created_at
                              FROM comments 
                              WHERE article_id = $1
                              ORDER BY created_at DESC;`;
          
          return db.query(commentQueryString, [article_id]);
      })
      .then(({ rows }) => {
          if (rows.length === 0) {
              return [];
          }
          return rows;
      });
};


exports.addCommentForArticle = (article_id, username, body) => {
  if (!article_id) {
    return Promise.reject({
      status: 400,
      msg: 'Missing required field: article_id',
    });
  }
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: 'Missing required field: username',
    });
  }
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: 'Missing required field: body',
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
  
exports.deleteComment = (comment_id) => {

    return db.query(
        'DELETE FROM comments WHERE comment_id = $1 RETURNING *;',
        [comment_id]
    ).then(({ rows }) => {
  
        return rows[0];
    });
};
