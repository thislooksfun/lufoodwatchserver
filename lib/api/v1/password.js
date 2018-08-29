"use strict";

const bcrypt = require("bcrypt");
const sha = require("sha.js");

// TODO: Tune this
const saltRounds = 10;

// This does a simple SHA265 hash into base64 to bypass bcrypt's 56/72 character input length limit
function encode(pw) {
  return sha("sha256").update(pw).digest("base64");
}

module.exports = {
  async hash(pw) {
    return bcrypt.hash(encode(pw), saltRounds);
  },
  
  async comparePasswords(pw, hash) {
    return bcrypt.compare(encode(pw), hash);
  }
};