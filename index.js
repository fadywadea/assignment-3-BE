"use strict";
import express from "express";
import productRouter from "./src/modules/products/products.router.js";
import userRouter from "./src/modules/users/user.router.js";

const app = express();
const port = 3000;

// middle ware
app.use(express.json());

// server running...
app.get("/", (req, res) => {
  res.json({ message: "server running..." })
})

// user APIs:
app.use(userRouter);

// product APIs:
app.use(productRouter);


// port the server
app.listen(port, () => {
  console.log(`server running...${port}`);
});
