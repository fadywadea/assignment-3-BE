"use strict";
import express from "express";
import { addUser, deleteUser, getUsers, productsUser, searchUser, updateUser, userId } from "./user.controller.js";

const router = express.Router();
const baseUrl = "/user";

// get all Users
router.get(baseUrl, getUsers);

// add user
router.post(baseUrl, addUser);

// update user
router.put(baseUrl, updateUser);

// delete user(user must be found)
router.delete(baseUrl, deleteUser);

// search for user
router.get("/searchUsers", searchUser);

// search for users by list of ids => using IN
router.get("/userID", userId);

// get all users with products
router.get("/productsUsers", productsUser);

export default router;