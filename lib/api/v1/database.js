"use strict";

const { Pool } = require("pg");
const pool = new Pool();


module.exports = {
  isOpen: true,
  
  query: pool.query.bind(pool),
  
  async transaction(actions) {
    let client = await pool.connect();
    try {
      await actions(client);
    } finally {
      client.release();
    }
  },
  
  async close() {
    log.trace("Draining DB pool...");
    await pool.end();
    log.trace("Pool drained...");
    this.isOpen = false;
  },
};