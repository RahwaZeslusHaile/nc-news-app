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
    return db.query(`ALTER TABLE articles DROP COLUMN body`)
    .then(()=>{
        return db.query(`SELECT articles .*,CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`);
    })
    .then(({rows})=>{
        const articles =rows
        if(!articles){
            return Promise.reject({status:404, msg: 'Article Not Found'})   
           }
           return articles;
})
}
  