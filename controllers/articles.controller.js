 const {selectArticleById,fetchArticles} = require('../models/articles.model')
 
 exports.getArticlesById=(request,response,next)=>{
  const{article_id} =request.params;
  selectArticleById(article_id).then((article)=>{
      response.status(200).send({article})
  }).catch(next)
   }


   exports.getArticles=(request,response,next)=>{
    
    fetchArticles().then((article)=>{
        response.status(200).send({article})
    }).catch(next)
     }