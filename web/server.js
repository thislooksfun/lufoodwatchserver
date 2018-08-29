"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const Router = express.Router;
const app = express();

const port = process.env.PORT || 8080;

function send405(req, res) {
  res.status(405).send("Method Not Allowed");
}

function add405(router) {
  for (let layer of router.stack) {
    if (layer.name === "router") {
      add405(layer.handle);
    } else if (layer.route != null) {
      layer.route.all(send405);
    }
  }
}

module.exports = {
  start() {
    app.use(bodyParser.json());
    
    let api = new Router();
    pquire("api").setupRoutes(api);
    app.use("/api", api);
    add405(app._router);
    
    // app.get("/", (req, res) => res.send("Hello World!"));
    //
    app.listen(port, function() {
      console.log("Listening on port 8080");
    });
  }
};