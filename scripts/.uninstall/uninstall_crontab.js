#!/usr/bin/env node

"use strict";

// We need root because we are going to write to /etc/cron.d/, which only root has write access to.
if (process.getuid == null || process.getuid() !== 0) {
  console.error("Please run as root!");
  process.exit(1);
}

const fs = require("fs");

if (!fs.existsSync("/etc/cron.d/lufoodwatch")) {
  console.error("/etc/cron.d/lufoodwatch does not exit, nothing to do!");
  process.exit(0);
}

fs.unlinkSync("/etc/cron.d/lufoodwatch");
