"use strict";

global.pquire = require("pquire");
global.log = require("tlf-log");

const nodeCleanup = require("node-cleanup");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

var db;
var server;

function closeServer() {
  if (server != null && server.running) {
    log.trace("Closing server...");
    return new Promise(function(resolve) {
      server.close().then(function() {
        log.trace("Server closed");
        resolve();
      });
    });
  } else {
    return false;
  }
}

function disconnectFromDB() {
  db = db || pquire("lib/api/v1/database");
  if (db.isOpen) {
    log.trace("Disconnecting from database...");
    return new Promise(function(resolve) {
      db.close().then(function() {
        log.trace("Disconnected from database");
        resolve();
      });
    });
  } else {
    return false;
  }
}

function finish(signal) {
  log.trace("Cleanup finished successfully, exiting!");
  process.kill(process.pid, signal);
}

nodeCleanup(function(exitCode, signal) {
  console.log();
  log.trace("Cleaning up...");
  
  var postpone = false;
  
  let cs = closeServer();
  if (cs) {
    cs.then(function() {
      let ddb = disconnectFromDB();
      if (ddb) {
        ddb.then(function() {
          finish(signal);
        });
      } else {
        finish(signal);
      }
    });
    
    postpone = true;
  } else {
    let ddb = disconnectFromDB();
    if (ddb) {
      ddb.then(function() {
        finish(signal);
      });
    }
  }
  
  
  if (postpone) {
    // Don't call handler again
    nodeCleanup.uninstall();
    return false;
  }
  //
  // if (server != null && server.running) {
  //   closeServer().then(function() {
  //     return disconnectFromDB();
  //   }).then(function() {
  //     finish(signal);
  //   });
  //   log.trace_("Closing server... ");
  //   server.close().then(function() {
  //     log.trace("done");
  //
  //     if (db.isOpen) {
  //
  //     } else {
  //       log.trace("Cleanup finished successfully, exiting!");
  //       process.kill(process.pid, signal);
  //     }
  //   });
  //
  // } else if (db.isOpen) {
  //   db.close().then(function() {
  //     log.trace("Disconnected from database");
  //
  //     log.trace("Cleanup finished successfully, exiting!");
  //     process.kill(process.pid, signal);
  //   });
  //
  //   // Don't call handler again
  //   nodeCleanup.uninstall();
  //   return false;
  // }
  //
  // log.trace("Cleanup finished successfully, exiting!");
});


(async function() {
  try {
    log._setLevel("debug");
    
    server = pquire("web/server");
    server.start();
  } catch (e) {
    log.error(e);
  }
})();