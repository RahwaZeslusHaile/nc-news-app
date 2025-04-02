const db =require('../db/connection')


exports.selectArticleById=(article_id)=>{
    
    return db.query('SELECT * FROM articles WHERE article_id =$1',[article_id])
    .then(({rows})=>{
        
        const article =rows[0]
        if(!article){
         return Promise.reject({status:404, msg: 'Article Not Found'})   
        }
        return article;
    
})
}

exports.fetchArticles = () => {
    return db.query(`
        SELECT articles.article_id, articles.title, articles.author, articles.created_at, 
               articles.votes, articles.topic, articles.article_img_url,
               CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `)
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article Not Found' });
        }
        return rows;
    });
};

exports.modifyArticleVotes = (article_id, inc_votes) => {
    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: 'Invalid vote value' });
    }

    return db.query(
        `UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2
        RETURNING *;`,[inc_votes, article_id]
    ).then(({ rows }) => {
       
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return rows[0]; 
    });
};
