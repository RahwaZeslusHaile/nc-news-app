const { fetchCommentsByArticleId,addCommentForArticle,deleteComment } = require('../models/comments.model');

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;

    fetchCommentsByArticleId(article_id)
        .then((comments) => {
            
            response.status(200).send({ comments });
        })
        .catch((err) => {
            if (err.status) {
                response.status(err.status).send({ msg: err.msg });
            } else {
                next(err);
            }
        });
    };

    exports.postCommentsByArticleId = (request, response, next) => {
        const { article_id } = request.params;
        const { username, body } = request.body;
            
        addCommentForArticle(article_id, username, body)
          .then((newComment) => {
            
            response.status(201).send({ comment: newComment });
          })
          .catch((error) => {
            
            next(error);
          });
      };
     

      exports.removeCommentById = (request, response, next) => {
        const { comment_id } = request.params;

       
    
        deleteComment(comment_id)
            .then((deletedComment) => {
               
                if (!deletedComment) {
                    return response.status(404).send({ msg: 'Comment not found' });
                }
                
                response.status(204).send();
            })
            .catch((error) => {
                
                next(error);
            });
    };
    
      
        