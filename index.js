"use strict";

global.pquire = require("pquire");
global.log = require("tlf-log");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

(async function() {
  try {
    log._setLevel("debug");
    
    pquire("web/server").start();
  } catch (e) {
    log.error(e);
  }
})();