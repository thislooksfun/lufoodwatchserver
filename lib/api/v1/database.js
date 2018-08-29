"use strict";

const { Pool } = require("pg");
const pool = new Pool();
const pw = pquire("lib/api/v1/password");
const sendEmail = pquire("notify/email").send;
const uuidv4 = require("uuid/v4");

const { MissingParameterError, InvalidParameterTypeError } = pquire("lib/util/errors");

class DuplicateUserError extends Error {
  constructor(email) {
    super("Duplicate user '" + email + "'");
    this.email = email;
    Error.captureStackTrace(this, this.constructor);
  }
}


module.exports = {
  async signUp(email, password) {
    // Ensure fields are present
    if (email == null) {
      throw new MissingParameterError("email");
    }
    if (password == null) {
      throw new MissingParameterError("password");
    }
    
    // Ensure fields are the correct type
    if (typeof email !== "string") {
      throw new InvalidParameterTypeError("email", "string", typeof email);
    }
    if (typeof password !== "string") {
      throw new InvalidParameterTypeError("password", "string", typeof password);
    }
    
    // TODO:
    let hash = await pw.hash(password);
    try {
      let res = await pool.query("INSERT INTO users(email, passhash) VALUES($1, $2) RETURNING *", [email, hash]);
      console.log("a", res);
      await this.sendEmailConfirmLink(email, res.rows[0].userid);
    } catch (e) {
      if (e.message === "duplicate key value violates unique constraint \"email\"") {
        throw new DuplicateUserError(email);
      } else {
        throw e;
      }
    }
  },
  
  async sendEmailConfirmLink(email, userid) {
    let token = uuidv4();
    
    await pool.query("INSERT INTO email_confirmation_tokens(userid, token) VALUES($1, $2)", [userid, token]);
    
    let confirmLink = `http://localhost:8080/api/v1/email/confirm/${token}`;
    // This call is technically async, but we don't want to wait until the email is actually sent before continuing
    // as it takes a significant amount of time to send (upwards of 2-5s).
    sendEmail({to: email, subject: "Confirm email", html:`<h1>Confirm your email</h1><a href="${confirmLink}">${confirmLink}</a>`});
  },
  
  async confirmEmail(token) {
    let row = (await pool.query("SELECT userid, expires_at<NOW() as expired FROM email_confirmation_tokens WHERE token=$1", [token])).rows[0];
    if (row == null || row.expired) {
      throw new Error("Invalid token");
    }
    if (row.expired) {
      throw new Error("Expired token");
    }
    
    // Mark the email as being verified
    await pool.query("UPDATE users SET email_verified = true WHERE userid=$1", [row.userid]);
  },
  
  // async disconnect() {
  //   await client.end();
  // },
  
  DuplicateUserError: DuplicateUserError,
};