import express from "express";
import { addProduct, deleteProduct, getProducts, searchProducts, updateProduct } from "./products.controller.js";

const router = express.Router();
const baseUrl = "/product";

// get all products
router.get(baseUrl, getProducts);

// add product
router.post(baseUrl, addProduct);

// delete product
router.delete(baseUrl, deleteProduct);

// update product (product owner only)
router.put(baseUrl, updateProduct);

// search for products where price greater than 3000
router.get("/searchProducts", searchProducts);

// export Router
export default router;