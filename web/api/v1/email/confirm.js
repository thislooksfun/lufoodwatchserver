"use strict";

const wrap = pquire("lib/util/wrap");
const codes = pquire("lib/util/httpCodes");
const users = pquire("lib/api/v1/db/users");


async function get(req, res) {
  console.log(req.params.token);
  await users.confirmEmail(req.params.token);
  
  // TODO: Make this page look better
  res.status(codes.ok).send("Success!");
}

module.exports = {
  setupRoutes(r) {
    r.route("/confirm/:token").get(wrap(get));
  }
};