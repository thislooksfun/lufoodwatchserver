#!/usr/bin/env node

"use strict";

// We need root because we are going to write to /etc/cron.d/, which only root has write access to.
if (process.getuid == null || process.getuid() !== 0) {
  console.error("Please run as root!");
  process.exit(1);
}


const fs = require("fs");

if (!fs.existsSync("/etc/cron.d")) {
  console.error("Error installing crontab: /etc/cron.d does not exit. Are you running this on macOS or Windows?");
  process.exit(1);
}

function username(id) {
  return require("child_process").execSync(`id -nu ${id}`, {encoding: "utf-8"}).trim();
}

// SUDO_UID will always exist, since we are forcing this to run as root (see lines 6-9)
let user = process.argv[2] || username(process.env.SUDO_UID);

console.log(`Installing crontab to run as user '${user}'`);

const path = require("path");

let projectRoot = path.dirname(__dirname);
let tab = fs.readFileSync(path.join(projectRoot, "crontab"), "utf-8");
let filled = tab.replace("{user}", user).replace("{project_root}", projectRoot);
fs.writeFileSync("/etc/cron.d/lufoodwatch", filled);