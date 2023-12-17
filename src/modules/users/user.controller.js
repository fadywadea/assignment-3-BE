import { query } from "../../../database/dbConnection.js";

// get all Users
export const getUsers = (req, res) => {
  query.execute("SELECT * FROM users", (err, data) => {
    err ?
      res.json({ error: err }) :
      res.json(data);
  });
}

// add user
export const addUser = (req, res) => {
  const { name, email, password, age } = req.body;
  query.execute(`INSERT INTO users (name,email,password,age) VALUES ('${name}','${email}','${password}','${age}')`,
    (err, data) => {
      err ?
        res.json({ error: err }) :
        res.json({ message: "User added successfully", data });
    });
}

// update user
export const updateUser = (req, res) => {
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
}

// delete user
export const deleteUser = (req, res) => {
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
}

// search for user where his name start with "a" and age less than 30 => using like for characters
export const searchUser = (req, res) => {
  const { age, name } = req.body;
  query.execute(`SELECT * FROM users WHERE name LIKE '%${name}%' AND age < ${age}`, (err, data) => {
    err ?
      res.json({ error: err }) :
      res.json(data);
  });
}

// search user by ID
export const userId = (req, res) => {
  const { id } = req.body;
  query.execute(`SELECT * FROM users WHERE id IN ('${id}')`, (err, data) => {
    err ?
      res.json({ error: err }) :
      data.length ?
        res.json(data) :
        res.json({ message: "User not founded" });
  });
}

// get all user with his products
export const productsUser = (req, res) => {
  const { id } = req.body;
  query.execute(`SELECT users.id, users.name, users.email, product.pName, product.price
    FROM users INNER JOIN product ON users.id = product.createdBy WHERE id = '${id}'`, (err, data) => {
    err ?
      res.json({ message: err }) :
      data.length ?
        res.json(data) :
        res.json({ message: "Not founded" });
  });
}