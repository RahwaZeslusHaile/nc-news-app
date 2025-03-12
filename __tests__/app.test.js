const endpointsJson = require("../endpoints.json");
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest'); 
/* Set up your test imports here */
afterAll(()=>{
  return db.end()
})
beforeEach(()=>{
  return seed(data)
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
      expect(typeof article.author).toBe('string');
      expect(typeof article.title).toBe('string');
      expect(typeof article.article_id).toBe('number');
      expect(typeof article.body).toBe('string');
      expect(typeof article.topic).toBe('string');
      expect(typeof article.created_at).toBe('string');
      expect(typeof article.votes).toBe('number');
      expect(typeof article.article_img_url).toBe('string');
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

test('GET /api/articles/:article_id responds 400 for invalid article_id format', () => {
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
                  const articles = body.article;
                  
                  expect(Array.isArray(articles)).toBe(true);
                  expect(articles.length).toBeGreaterThan(0);
              articles.forEach((article) => {
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
        
        



        describe('GET /api/articles/:article_id/comments', () => {
          test('200: responds with an array of comments for the given article_id with an expected properties', () => {
              return request(app)
               .get('/api/articles/3/comments')
                .expect(200)
                 .then(({ body }) => {
                  
                    const { comments} = body;
                    expect(Array.isArray(comments)).toBe(true);
                    expect(comments.length).toBeGreaterThan(0);
                    comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe('number');
                    expect(typeof comment.article_id).toBe('number');
                    expect(typeof comment.author).toBe('string');
                    expect(typeof comment.created_at).toBe('string');
                    expect(typeof comment.body).toBe('string');
                    expect(typeof comment.votes).toBe('number');
                    
                  });
                });
              })
                   
            test('404: responds with "Article not found" if the route is incorrect',()=>{
              return request(app)
              .get('/api/articles/9996/comments')
              .expect(404)
              .then(({body})=>{
                expect(body.msg).toBe('Comments Not Found');
              })
            })
            
          test('400: responds "Bad request" for an invalid article_id ', () => {
            return request(app)
                .get('/api/articles/i/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                });
        });
      
        
      }) 
    
describe('POST /api/articles/:article_id/comments', () => {
  test('201: adds a comment for the specified article', () => {
    const newComment = { username: 'lurker', body: 'Great article!' };
    return request(app)
      .post('/api/articles/3/comments') 
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        console.log(body)
        expect(typeof body.comment.comment_id).toBe('number');
        expect(typeof body.comment.article_id).toBe('number');
        expect(typeof body.comment.body).toBe('string');;
        expect(body.comment.author).toEqual('lurker');
        expect(typeof body.comment.body).toBe('string');
        expect(typeof body.comment.created_at).toBe('string');
      });

    })

      
        test('400: responds with error when username or body is missing', () => {
          const newComment = { body: 'Great article!' }; 
          return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Missing required fields: article_id, username, and body');
            });
        });
      
        test('404: responds with error when article_id does not exist', () => {
          const newComment = { username: 'Rahwa', body: 'Great article!' };
          return request(app)
            .post('/api/articles/9999/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Article not found');
            });
        });
      });
      
      
      



                              
                             
                  