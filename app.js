const express = require("express");
const app = express();
const { getApiDocumentation ,getTopics} = require("./controllers/topics.controller");
const{getArticlesById,updateArticleVotes,getArticles}= require('./controllers/articles.controller')
const {getCommentsByArticleId,postCommentsByArticleId,removeCommentById} = require('./controllers/comments.controller')
const{handlePSQLErrors,handleCustomErrors,handleServerErrors}= require('./error_handler')
const{getAllUsers}= require('./controllers/users.controller')


app.use(express.json());

app.get("/api", getApiDocumentation);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments",postCommentsByArticleId)
app.patch("/api/articles/:article_id", updateArticleVotes);
app.delete("/api/comments/:comment_id",removeCommentById)

app.get("/api/users", getAllUsers);

app.all('*',(request,response,next)=>{

  response.status(404).send({ msg: 'Not Found' });
})

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
