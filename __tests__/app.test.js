const endpointsJson = require("../endpoints.json");
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest'); 
/* Set up your test imports here */
beforeEach(()=>{
  return seed(data)
})
afterAll(()=>{
  return db.end()
})

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        console.log(body, '<=========body');
        const { endpoints } = body;  
        expect(endpoints).toEqual(endpointsJson);  
      });
  });
});