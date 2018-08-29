"use strict";

const Router = require("express").Router;

module.exports = {
  setupRoutes(r) {
    let v1 = new Router();
    pquire("v1").setupRoutes(v1);
    r.use("/v1", v1);
  }
};
