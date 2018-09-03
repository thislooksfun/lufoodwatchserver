"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const {deEscalate} = pquire("lib/util/safety");

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

var server = null;
module.exports = {
  start() {
    app.use(bodyParser.json());
    
    let api = new Router();
    pquire("api").setupRoutes(api);
    app.use("/api", api);
    add405(app._router);
    
    var username;
    try {
      username = fs.readFileSync(path.join(__dirname, "../../.username"), "utf-8").trim();
    } catch (e) {
      log.fatal("Username file not found, aborting!");
    }
    
    this.running = true;
    server = app.listen(port, function() {
      log.trace("Listening on port 8080");
      deEscalate({username: username});
      log.trace("Ready for connections");
    });
  },
  
  async close() {
    return new Promise(function(resolve, reject) {
      server.close(function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};