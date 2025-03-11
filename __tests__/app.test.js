const endpointsJson = require("../endpoints.json");
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest'); 
const { string } = require("pg-format");
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

describe('GET/api/articles/:article_id',()=>{
  test('200: Responds with an article object with the expected properties',()=>{
    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(({body})=>{
      
      const article = body.article
      expect(article).toHaveProperty('author');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('article_id');
      expect(article).toHaveProperty('body');
      expect(article).toHaveProperty('topic');
      expect(article).toHaveProperty('created_at');
      expect(article).toHaveProperty('votes');
      expect(article).toHaveProperty('article_img_url');
    });
  });

  test('GET /api/articles/:article_id returns 404 for non-existent article', () => {
    return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
        });
});

test('GET /api/articles/:article_id returns 400 for invalid article_id format', () => {
    return request(app)
        .get('/api/articles/Rahwa')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
        });
});
})

      describe('GET /api/articles', () => {
        test('200: responds with an array of article objects with an expected properties', () => {
            return request(app)
             .get('/api/articles')
              .expect(200)
               .then(({ body }) => {
                  const { article } = body;
                  console.log(article)
                  expect(Array.isArray(article)).toBe(true);
                  expect(article.length).toBeGreaterThan(0);
              article.forEach((article) => {
                  expect(typeof article.article_id).toBe('number');
                  expect(typeof article.title).toBe('string');
                  expect(typeof article.topic).toBe('string');
                  expect(typeof article.author).toBe('string');
                  expect(typeof article.created_at).toBe('string');
                  expect(typeof article.votes).toBe('number');
                  expect(typeof article.article_img_url).toBe('string');
                  expect(typeof article.comment_count).toBe('number');
                  expect(article.body).toBeUndefined(); 
                });
              });
            })
                 
          test('404: responds with an error if the route is incorrect',()=>{
            return request(app)
            .get('/api/art1cles')
            .expect(404)
            .then(({body})=>{
              expect(body.msg).toBe('Not Found');
            })
          })
        })                
                              
                             
                  