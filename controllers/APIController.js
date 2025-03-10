const endpoints = require("../endpoints.json");

exports.getApiDocumentation = (request, response, next) => {
  response.status(200).send({ endpoints });
};




