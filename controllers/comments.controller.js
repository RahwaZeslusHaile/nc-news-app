const { fetchCommentsByArticleId } = require('../models/comments.model');

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
