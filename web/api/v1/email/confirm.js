"use strict";

const wrap = pquire("lib/util/wrap");
const codes = pquire("lib/util/httpCodes");
const db = pquire("lib/api/v1/database");
// const email = pquire("lib/api/v1/notify/email");



async function get(req, res) {
  console.log(req.params.token);
  await db.confirmEmail(req.params.token);
  
  // TODO: Make this page look better
  res.status(codes.ok).send("Success!");
}

module.exports = {
  setupRoutes(r) {
    r.route("/confirm/:token").get(wrap(get));
  }
};