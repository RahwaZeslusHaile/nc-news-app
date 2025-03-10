const express = require("express");
const app = express();
const { getApiDocumentation } = require("./controllers/APIController");

app.use(express.json());

app.get("/api", getApiDocumentation);

app.use((error, request, response, next) => {
  response.status(500).send({ error: "Error reading documentation file" });
});

module.exports = app;
