const express = require("express");
const app = express();
const { getApiDocumentation ,getTopics} = require("./controllers/topics.controller");
const{getArticlesById,getArticles}= require('./controllers/articles.controller')
const{handlePSQLErrors,handleCustomErrors,handleServerErrors}= require('./error_handler')
app.use(express.json());

app.get("/api", getApiDocumentation);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);

app.all('*',(request,response,next)=>{
  response.status(404).send({ msg: 'Not Found' });
})

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
