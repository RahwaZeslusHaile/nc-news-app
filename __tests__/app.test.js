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


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;  
        expect(endpoints).toEqual(endpointsJson);  
      });
  });
});

describe('GET/api/topics',()=>{
  test('200: Responds with an array of topic object with slug and description',()=>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body})=>{
       const topics  = body.topics
       expect(Array.isArray(topics)).toBe(true),
         expect(topics.length).toBeGreaterThan(0),
       topics.forEach((topic)=>{
        expect(typeof topic.slug).toBe('string'),
        expect(typeof topic.description).toBe('string')
        })

       })
    })

    test('404: responds with an error if the route is incorrect',()=>{
      return request(app)
      .get('/api/t0pics')
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('Not Found');
      })
    })
  })


  
  
