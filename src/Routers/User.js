const express = require("express");
const user = express.Router();
const {
  logIn,
  logOut,
  userRegister,
} = require("../Controllers/UserControllers");
user.post("/v1/logIn", logIn);
user.get("/v1/logOut", logOut);
user.post("/v1/register", userRegister);
module.exports = user;
