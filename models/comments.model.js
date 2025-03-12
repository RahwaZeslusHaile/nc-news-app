const db =require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    let queryString = `SELECT comment_id, article_id, body, votes, author, created_at FROM comments `;
    
    const queryParams = [];

    if (article_id) {
        queryParams.push(article_id);
        queryString += ` WHERE article_id = $1 ORDER BY created_at DESC`;
    }

    return db.query(queryString, queryParams).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Comments Not Found' });
        }
        return rows;
    });
};
