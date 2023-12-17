import { query } from "../../../database/dbConnection.js";

// get all products
export const getProducts = (req, res) => {
  query.execute("SELECT * FROM product", (err, data) => {
    err ?
      res.json({ message: err }) :
      res.json(data);
  });
}

// add product
export const addProduct = (req, res) => {
  const { pName, pDescription, price, createdby } = req.body;
  query.execute(`INSERT INTO product (pName, pDescription, price, createdby) VALUES ('${pName}','${pDescription}',
  '${price}','${createdby}')`, (err, data) => {
    err ?
      res.json({ message: err }) :
      res.json({ message: "Product added successfully" });
  });
}

// delete product
export const deleteProduct = (req, res) => {
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
}

// update product
export const updateProduct = (req, res) => {
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
}

// search for products where price greater than 3000
export const searchProducts = (req, res) => {
  query.execute("SELECT * FROM product WHERE price > 3000", (err, data) => {
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
}