"use strict";

let {execSync} = require("child_process");

module.exports = {
  // WARNING: PASSING A USER-CONTROLLED STRING AS A USERNAME CAN RESULT IN ARBETRARY SHELL CODE EXECUTION
  // Opts: {strict: bool = true, useSudoer: bool = false, uid: number = null, username: string = "nobody"}
  // > opts.uid takes precedence over opts.username
  // > if opts.useSudoer === true and opts.uid == null, then uid will be set to process.env.SUDO_UID
  deEscalate(opts) {
    opts = opts || {};
    let strict = (opts.strict != null ? opts.strict : true);
    
    if (process.env.SUDO_UID == null) {
      // Not sudo, nothing for us to do!
      return;
    }
    if (process.seteuid == null) {
      // This was run as sudo, but we can't do anything about it!
      if (strict) {
        log.fatal("process.seteuid is not defined, can't de-escalate, aborting!");
      }
      return;
    }
    
    let useSudoer = (opts.useSudoer != null ? opts.useSudoer : false);
    let uid = opts.uid || (useSudoer ? process.env.SUDO_UID : null);
    let username = opts.username || "nobody";
    
    
    if (typeof uid === "string") {
      uid = parseInt(uid);
    }
    if (!!uid && typeof uid !== "number") {
      log.warn(`Invalid type for parameter 'uid': ${typeof uid}; expected 'number' (or a string that is a number)`);
      if (strict) {
        log.fatal("Aborting due to invalid uid type");
      }
      return;
    }
    
    // Catch 'undefined', 'null', 'NaN', and empty string
    if (!uid) {
      log.debug(`No uid specified, getting uid from username '${username}'`);
      // No uid specified, default to 'nobody'
      uid = parseInt(execSync(`id -u ${username}`, {encoding: "utf-8"}));
      if (!uid) {
        log.warn(`Failed Getting uid from username ${username}`);
        if (strict) {
          log.fatal("Aborting due to failed username -> uid conversion");
        }
        return;
      }
    }
    
    try {
      log.debug(`De-escalating uid from ${process.geteuid()} to ${uid}`);
      process.seteuid(uid);
      log.trace(`Successfully de-escalated to user ${process.geteuid()}`);
    } catch (e) {
      log.error("Error during de-escalation: " + e.message);
      if (strict) {
        log.fatal("De-escalation from root user failed, aborting!");
      }
    }
  }
};