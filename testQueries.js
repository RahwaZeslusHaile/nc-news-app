const db = require("./db/connection");

db.query("SELECT * FROM users;")
        .then(({ rows }) => {
          console.log("All users:", rows);
});


db.query("SELECT * FROM articles WHERE topic = 'coding';")
            .then(({ rows }) => {
             console.log("Articles about coding:", rows);
});


db.query("SELECT * FROM comments WHERE votes < 0;")
       .then(({ rows }) => {
        console.log("Comments with negative votes:", rows);
});


db.query("SELECT * FROM topics;")
          .then(({ rows }) => {
          console.log("All topics:", rows);
});

db.query("SELECT * FROM articles WHERE author = 'grumpy19';")
         .then(({ rows }) => {
           console.log("Articles by grumpy19:", rows);
});


db.query("SELECT * FROM comments WHERE votes > 10;")
                   .then(({ rows }) => {
                     console.log("Comments with more than 10 votes:", rows);
});
