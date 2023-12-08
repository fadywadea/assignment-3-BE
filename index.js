const express = require('express');
const mysql = require('mysql2');
const app = express();

const query = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'assignment-3'
});

app.use(express.json());

//* user APIs:

// get all Users
app.get('/', (req, res) => {
  query.execute("select * from users", (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage });
    } else {
      res.json(data);
    }
  });
});


// add user (user must not found before)
app.post('/addUser', (req, res) => {
  const { name, email, password, age } = req.body;

  query.execute(`insert into users (name,email,password) values ('${name}','${email}','${password}')`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage, message: 'Email already existed' });
    } else {
      res.json({ message: 'User added successfully' });
    }
  });
});



// update user 
app.put('/updateUser', (req, res) => {
  const { id, name, password } = req.body;

  query.execute(`select * from users where id='${id}'`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage });
    } else {
      if (data.length) {

        query.execute(`update users set name='${name}',password='${password}' where id='${id}'`, (err, data) => {
          if (err) {
            const { sqlMessage } = err;
            res.json({ error: sqlMessage });
          } else {
            res.json({ message: 'User updated successfully' });
          }
        });
      } else {
        res.json({ error: "No such User" });
      }
    }
  });
});


// delete user(user must be found)
app.delete('/deleteUser', (req, res) => {
  const { id } = req.body;

  query.execute(`select * from users where id='${id}'`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage });
    } else {
      if (data.length) {

        query.execute(`delete from users where id='${id}'`, (err, data) => {
          if (err) {
            const { sqlMessage } = err;
            res.json({ error: sqlMessage });
          } else {
            res.json({ message: 'deleted successfully' });
          }
        });
      } else {
        res.json({ message: 'User not founded' });
      };
    }
  });
});


// search for user where his name start with "a" and age less than 30 => using like for characters
app.get('/searchUsers', (req, res) => {

  query.execute("SELECT * FROM users WHERE name LIKE 'a%' AND age < 30", (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage })
    } else {
      res.json(data);
    }
  });
});


// search for users by list of ids => using IN
app.get('/userID', (req, res) => {
  const { id } = req.body;

  query.execute(`SELECT * FROM users WHERE id IN (${id})`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ error: sqlMessage });
    } else {
      if (data.length) {
        res.json(data);
      } else {
        res.json({ message: "User not founded" });
      }
    }
  });
});


// get all users with products
app.get('/productsUsers', (req, res) => {
  const { id } = req.body;

  query.execute(`SELECT users.id, users.name, users.email, product.pName, product.price
    FROM users INNER JOIN product ON users.id = product.createdBy WHERE id = '${id}'`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ message: sqlMessage });
    } else {
      if (data.length) {
        res.json(data);
      } else {
        res.json({ message: "Not founded" });
      }
    }
  });
});


//* product APIs:

// get all products
app.get('/products', (req, res) => {
  query.execute("select * from product", (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ message: sqlMessage });
    } else {
      res.json(data);
    }
  });
});


// add product(product must not found before)
app.post('/addProduct', (req, res) => {
  const { pName, pDescription, price, createdby } = req.body;

  query.execute(`insert into product (pName, pDescription, price, createdby) values ('${pName}','${pDescription}','${price}'
    ,'${createdby}')`, (err, data) => {
    if (err) {
      res.json({ message: "Can't add user" });
    } else {
      res.json({ message: 'Product added successfully', data });
    }
  });
});


// delete product (product owner only can do this and product must be found)
app.delete('/deleteProduct', (req, res) => {
  const { id, createdby, product_id } = req.body;

  query.execute(`select * from users where id='${id}'`, (err, data) => {

    if (err) {
      const { sqlMessage } = err;
      res.json({ message: sqlMessage });
    } else {

      // if user_id not valid
      if (data.length == 0) {
        console.log(data.length, "id_user:not founded");
        res.json({ message: "user not founded" });
      } else {

        // if user_id valid
        if (data.length > 0) {
          console.log(data.length, "id_user: founded");
          query.execute(`select * from product where createdby='${createdby}'`, (err, data) => {

            if (err) {
              const { sqlMessage } = err;
              res.json({ message: sqlMessage });
            } else {

              // if not created by user
              if (data.length == 0) {
                console.log(data.length, "not creator");
                res.json({ message: "not auth" });
              } else {

                // if created by user
                if (data.length > 0) {
                  console.log(data.length, "creator");
                  query.execute(`delete from product where product_id='${product_id}'`, (err, data) => {

                    if (err) {
                      const { sqlMessage } = err;
                      res.json({ message: sqlMessage });
                    } else {

                      // if product_id not valid
                      if (data.affectedRows == 0) {
                        console.log(data, "product_id{1}");
                        res.json({ message: 'Product not founded' });
                      } else {

                        // if product_id valid
                        if (data.affectedRows > 0) {
                          console.log(data, "product_id{2}");
                          res.json({ message: 'Product deleted successfully', data });
                        }
                      }
                    }
                  });
                }
              };
            };
          });
        }
      }

    };
  });
});


// update product (product owner only)
app.put('/updateProduct', (req, res) => {
  const { id, pDescription, price, createdby, product_id } = req.body;

  // user id
  query.execute(`select * from users where id='${id}'`, (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ message: sqlMessage });
    } else {

      // if user_id not valid
      if (data.length == 0) {
        console.log(data.length, "user_ID not valid");
        res.json({ message: 'User not founded' });
      } else {

        // if user_id valid
        if (data.length > 0) {
          console.log(data.length, "user_ID valid");

          // select createdby
          query.execute(`select * from product where createdby='${createdby}'`, (err, data) => {

            if (err) {
              const { sqlMessage } = err;
              res.json({ message: sqlMessage });
            } else {

              // if not createdby by user
              if (data.length == 0) {
                console.log(data.length, "createdby not valid");
                res.json({ message: "not auth" });
              } else {

                // if createdby by user
                if (data.length > 0) {
                  console.log(data.length, "createdby valid");
                  query.execute(`update product set pDescription='${pDescription}',price='${price}'
                  where product_id='${product_id}'`, (err, data) => {

                    if (err) {
                      const { sqlMessage } = err;
                      res.json({ message: sqlMessage });
                    } else {

                      // if product_id not valid
                      if (data.affectedRows == 0) {
                        console.log(data.affectedRows, "product_id not valid");
                        res.json({ message: "product_id not valid" });
                      } else {

                        //if product_id valid
                        if (data.affectedRows > 0) {
                          console.log(data.affectedRows, "product_id valid");
                          res.json({ message: 'Product updated successfully' });
                        }
                      }
                    }
                  });
                }
              }
            }
          });
        }
      }
    }
  });
});


// search for products where price greater than 3000
app.get('/searchProducts', (req, res) => {
  query.execute("SELECT * FROM product WHERE price > 3000", (err, data) => {
    if (err) {
      const { sqlMessage } = err;
      res.json({ message: sqlMessage });
    } else {
      res.json(data);
    }
  });
});


// port the server
app.listen(3000, () => {
  console.log("server running...");
})