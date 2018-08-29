#!/usr/bin/env node

"use strict";

const { Pool } = require("pg");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

(async function() {
  // Create a pool
  let pool = new Pool();
  
  // Clean out old tokens
  pool.query("DELETE FROM email_confirmation_tokens WHERE expires_at + INTERVAL '1 week' < NOW()");
  // Clean out old unconfirmed users
  pool.query("DELETE FROM users WHERE email_verified = false AND created_at + INTERVAL '1 day' < NOW()");
  
  // Close the pool
  pool.end();
})();