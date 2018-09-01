"use strict";

global.pquire = require("pquire");
global.log = require("tlf-log");

const nodeCleanup = require("node-cleanup");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

var db;
nodeCleanup(function(exitCode, signal) {
  console.log();
  log.trace("Cleaning up...");
  db = db || pquire("lib/api/v1/database");
  if (db.isOpen) {
    db.close().then(function() {
      log.trace("Cleanup finished successfully, exiting!");
      process.kill(process.pid, signal);
    });
    
    // Don't call handler again
    nodeCleanup.uninstall();
    return false;
  }
});


(async function() {
  try {
    log._setLevel("debug");
    
    pquire("web/server").start();
  } catch (e) {
    log.error(e);
  }
})();