const endpointsJson = require("../endpoints.json");
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest'); 


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
              test('200: should return an empty array when an article exists but has no comments', () => {
                return request(app)
                  .get('/api/articles/2/comments') 
                  .expect(200)
                  .then(({ body }) => {
                    
                    expect(body.comments).toEqual([]); 
                  });
              });
              
                   
            test('404: responds with "Article not found" if the route is incorrect',()=>{
              return request(app)
              .get('/api/articles/9996/comments')
              .expect(404)
              .then(({body})=>{
                expect(body.msg).toBe('Article Not Found');
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
      
        expect(body.comment.article_id).toBe(3);
        expect(body.comment.author).toEqual('lurker');
        expect(body.comment.body).toBe('Great article!');
        expect(new Date(body.comment.created_at).toString()).not.toBe('Invalid Date');
      });

    })

      
        test('400: responds with error when username or body is missing', () => {
          const newComment = { body: 'Great article!' }; 
          return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Missing required field: username');
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



      describe('PATCH /api/articles/:article_id', () => {
        test('200: should increment the article votes when given a positive inc_votes value', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body }) => {
                  
                    expect(body.article).toMatchObject({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 101, 
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at: '2020-07-09T20:11:00.000Z'
                  });
                });
        });
    
        test('200: should decrement the article votes when given a negative inc_votes value', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: -10 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toMatchObject({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        body: 'I find this existence challenging',
                        votes: 90, 
                        topic: 'mitch',
                        author: 'butter_bridge',
                        created_at:'2020-07-09T20:11:00.000Z'
                    });
                });
        });
    
        test('400: should respond an error when inc_votes is missing', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid vote value');
                });
        });
    
        test('400: should respond an error when inc_votes is not a number', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 'invalid' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid vote value');
                });
        });
    
        test('404: should respond an error when article_id does not exist', () => {
            return request(app)
                .patch('/api/articles/9999')
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Article not found");
                });
        });
    
        test('400: should respond an error when article_id is invalid', () => {
            return request(app)
                .patch('/api/articles/not-a-valid-id')
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                });
        });
    });
describe('DELETE /api/comments/:comment_id ', () => {
  test('204: should delete a comment and return 204', () => {
  return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(() => {
      return request(app)
        .get('/api/comments/1') 
        .expect(404);
     
  });

});


test('404:should respond an error for a non-existing comment', () => {
  return request(app)
    .delete('/api/comments/999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Comment not found');
    });
});

test('404: should respond an error for an invalid comment_id', () => {
  return request(app)
    .delete('/api/comments/abc')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad Request');
    });
});
    })

    describe('GET /api/users', () => {
  
      test('200: should return an array of users with the correct properties', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            const users = body.users
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
            users.forEach(user => {
              
        expect(typeof user.username).toBe('string'),
        expect(typeof user.name).toBe('string')
        expect(typeof user.avatar_url).toBe('string')
        
                })
              
            });
          });
          test('404: responds with an error if the route is incorrect',()=>{
            return request(app)
            .get('/api/usors')
            .expect(404)
            .then(({body})=>{
              expect(body.msg).toBe('Not Found');
            })
          })
         
      })      
    