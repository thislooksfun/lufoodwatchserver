"use strict";

module.exports = {
  apps: [{
    name: "LUFoodWatch Server",
    script: "webserver/index.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};