"use strict"
const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

// Connect to database
const query = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "assignment-3",
});

// middle ware
app.use(express.json());

//* user APIs:

// get all Users
app.get("/", (req, res) => {
  query.execute("SELECT * FROM users", (err, data) => {
    err ?
      res.json({ error: err }) :
      res.json(data);
  });
});

// add user (user must not found before)
app.post("/addUser", (req, res) => {
  const { name, email, password, age } = req.body;
  query.execute(`INSERT INTO users (name,email,password,age) VALUES ('${name}','${email}','${password}','${age}')`,
    (err, data) => {
      err ?
        res.json({ error: err }) :
        res.json({ message: "User added successfully", data });
    });
});

// update user
app.put("/updateUser", (req, res) => {
  const { id, name, password } = req.body;
  query.execute(`SELECT * FROM users WHERE id='${id}'`, (err, data) => {
    err ?
      res.json({ error: err }) :
      data.length ?
        query.execute(`UPDATE users SET name='${name}',password='${password}' WHERE id='${id}'`, (err, data) => {
          err ?
            res.json({ error: err }) :
            res.json({ message: "User updated successfully", data });
        }) : res.json({ error: "User not founded" });
  });
});

// delete user(user must be found)
app.delete("/deleteUser", (req, res) => {
  const { id } = req.body;
  query.execute(`SELECT * FROM users WHERE id='${id}'`, (err, data) => {
    err ?
      res.json({ error: err }) :
      data.length ?
        query.execute(`DELETE FROM users WHERE id='${id}'`, (err, data) => {
          err ?
            res.json({ error: err }) :
            res.json({ message: "deleted successfully", data });
        }) : res.json({ message: "User not founded" });
  });
});

// search for user where his name start with "a" and age less than 30 => using like for characters
app.get("/searchUsers", (req, res) => {
  const { age, name } = req.body;
  query.execute(`SELECT * FROM users WHERE name LIKE '%${name}%' AND age < ${age}`, (err, data) => {
    err ?
      res.json({ error: err }) :
      res.json(data);
  });
});

// search for users by list of ids => using IN
app.get("/userID", (req, res) => {
  const { id } = req.body;
  query.execute(`SELECT * FROM users WHERE id IN ('${id}')`, (err, data) => {
    err ?
      res.json({ error: err }) :
      data.length ?
        res.json(data) :
        res.json({ message: "User not founded" });
  });
});

// get all users with products
app.get("/productsUsers", (req, res) => {
  const { id } = req.body;
  query.execute(`SELECT users.id, users.name, users.email, product.pName, product.price
    FROM users INNER JOIN product ON users.id = product.createdBy WHERE id = '${id}'`, (err, data) => {
    err ?
      res.json({ message: err }) :
      data.length ?
        res.json(data) :
        res.json({ message: "Not founded" });
  });
});

//* product APIs:

// get all products
app.get("/products", (req, res) => {
  query.execute("SELECT * FROM product", (err, data) => {
    err ?
      res.json({ message: err }) :
      res.json(data);
  });
});

// add product(product must not found before)
app.post("/addProduct", (req, res) => {
  const { pName, pDescription, price, createdby } = req.body;
  query.execute(`INSERT INTO product (pName, pDescription, price, createdby) VALUES ('${pName}','${pDescription}',
  '${price}','${createdby}')`, (err, data) => {
    err ?
      res.json({ message: err }) :
      res.json({ message: "Product added successfully", data });
  });
});

// delete product (product owner only can do this and product must be found)
app.delete("/deleteProduct", (req, res) => {
  const { id, createdby, product_id } = req.body;
  // select user
  query.execute(`SELECT * FROM users WHERE id='${id}'`, (err, data) => {
    err ?
      res.json({ message: err }) :
      // if user founded
      data.length > 0 ?
        query.execute(`SELECT * FROM product WHERE createdby='${createdby}'`, (err, data) => {
          err ?
            res.json({ message: err }) :
            // if user created this product
            data.length > 0 ?
              query.execute(`DELETE FROM product WHERE product_id='${product_id}'`, (err, data) => {
                err ?
                  res.json({ message: err }) :
                  // if product founded
                  data.affectedRows > 0 ?
                    res.json({ message: "Product deleted successfully" }) :
                    res.json({ message: "Product not founded" })
              }) : res.json({ message: "not auth" })
        }) : res.json({ message: "user not founded" })
  });
});

// update product (product owner only)
app.put("/updateProduct", (req, res) => {
  const { id, pDescription, price, createdby, product_id } = req.body;
  // user id
  query.execute(`SELECT * FROM users WHERE id='${id}'`, (err, data) => {
    err ?
      res.json({ message: err }) :
      // if user_id valid
      data.length > 0 ? query.execute(`SELECT * FROM product WHERE createdby='${createdby}'`, (err, data) => {
        err ?
          res.json({ message: err }) :
          // if createdby by user
          data.length > 0 ?
            query.execute(`UPDATE product SET pDescription='${pDescription}', price='${price}'
              WHERE product_id='${product_id}'`, (err, data) => {
              err ?
                res.json({ message: err }) :
                //if product_id valid
                data.affectedRows > 0 ?
                  res.json({ message: "Product updated successfully" }) :
                  res.json({ message: "product_id in valid" });
            }) : res.json({ message: "Not auth" });
      }) : res.json({ message: "User not founded" });
  });
});

// search for products where price greater than 3000
app.get("/searchProducts", (req, res) => {
  query.execute("SELECT * FROM product WHERE price > 9", (err, data) => {
    if (err) {
      res.json({ message: err });
    } else {
      if (data == 0) {
        res.json({ message: "not founded products" });
      } else {
        const { pName, pDescription, price } = data[0];
        // .find(products => products.pName && products.pDescription && products.price);\
        res.json({ pName, pDescription, price });
      }
    }
  });
});

// port the server
app.listen(port, () => {
  console.log(`server running...${port}`);
});
