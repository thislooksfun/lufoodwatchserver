"use strict";

const pw = pquire("lib/api/v1/password");
const db = pquire("lib/api/v1/database");
const sendEmail = pquire("lib/api/v1/notify/email").send;
const uuidv4 = require("uuid/v4");
const verify = pquire("lib/util/verifyParam");

class DuplicateUserError extends Error {
  constructor(email) {
    super("Duplicate user '" + email + "'");
    this.email = email;
    Error.captureStackTrace(this, this.constructor);
  }
}

async function sendEmailConfirmLink(email, userid) {
  // Delete any existing tokens
  await db.query("DELETE FROM email_confirmation_tokens WHERE userid = $1", [userid]);
  // Generate a new token
  let token = uuidv4();
  // Insert the new token
  await db.query("INSERT INTO email_confirmation_tokens(userid, token) VALUES($1, $2)", [userid, token]);
  
  // Construct a URL to verify the email
  let confirmLink = `http://localhost:8080/api/v1/email/confirm/${token}`;
  // This call is technically async, but we don't want to wait until the email is actually sent before continuing
  // as it takes a significant amount of time to send (upwards of 2-5s).
  sendEmail({to: email, subject: "Confirm email", html:`<h1>Confirm your email</h1><a href="${confirmLink}">${confirmLink}</a>`});
}

async function generateAuthToken(userid, desc) {
  // Delete any existing tokens
  await db.query("DELETE FROM auth_tokens WHERE userid = $1", [userid]);
  // Generate a new token
  let token = uuidv4();
  // Insert the new token
  await db.query("INSERT INTO auth_tokens(token, userid, description) VALUES($1, $2, $3)", [token, userid, desc]);
  
  return token;
}

module.exports = {
  
  async signUp(email, password) {
    verify(email,    "email",    "string");
    verify(password, "password", "string");
    
    let hash = await pw.hash(password);
    try {
      let res = await db.query("INSERT INTO users(email, passhash) VALUES($1, $2) RETURNING *", [email, hash]);
      console.log("a", res);
      await sendEmailConfirmLink(email, res.rows[0].userid);
    } catch (e) {
      if (e.message === "duplicate key value violates unique constraint \"email\"") {
        throw new DuplicateUserError(email);
      } else {
        throw e;
      }
    }
  },
  
  async signIn(email, password) {
    log.trace(`Attempting to sign in user '${email}'`);
    verify(email,    "email",    "string");
    verify(password, "password", "string");
    
    let res = await db.query("SELECT userid, passhash FROM users WHERE email = $1", [email]);
    let usr = res.rows[0];
    
    if (usr == null) {
      log.trace(`No user found for email '${email}'`);
      return null;
    }
    
    if (!await pw.compare(password, usr.passhash)) {
      log.trace(`Incorrect password for user '${email}'`);
      return null;
    }
    
    // TODO: Add actual device description
    let token = await generateAuthToken(usr.userid, "TODO");
    log.trace(`Logged in user ${email} with token ${token}`);
    return token;
  },
  
  async confirmEmail(token) {
    let tkn = log.trace("Confirming email for token " + token);
    let row = (await db.query("SELECT userid, expires_at<NOW() as expired FROM email_confirmation_tokens WHERE token=$1", [token])).rows[0];
    if (row == null || row.expired) {
      throw new Error("Invalid token");
    }
    if (row.expired) {
      throw new Error("Expired token");
    }
    
    // Mark the email as being verified
    await db.query("UPDATE users SET email_verified = true WHERE userid=$1", [row.userid]);
  },
  
  DuplicateUserError: DuplicateUserError,
};