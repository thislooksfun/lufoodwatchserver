"use strict";

const Router = require("express").Router;

module.exports = {
  setupRoutes(r) {
    let email = new Router();
    pquire("email").setupRoutes(email);
    r.use("/email", email);
    
    pquire("signin").setupRoutes(r);
    pquire("signup").setupRoutes(r);
  }
};