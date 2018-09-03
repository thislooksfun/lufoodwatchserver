"use strict";

const wrap = pquire("lib/util/wrap");
const codes = pquire("lib/util/httpCodes");
const users = pquire("lib/api/v1/db/users");

const { MissingParameterError, InvalidParameterTypeError } = pquire("lib/util/verifyParam");
const DuplicateUserError = users.DuplicateUserError;



async function post(req, res) {
  try {
    await users.signUp(req.body.email, req.body.password);
    res.status(codes.ok).send("Success!");
  } catch (e) {
    if (e instanceof MissingParameterError || e instanceof InvalidParameterTypeError || e instanceof DuplicateUserError) {
      res.status(codes.bad_request).send(e.message);
    } else {
      throw e;
    }
  }
}

module.exports = {
  setupRoutes(r) {
    r.route("/signup").post(wrap(post));
  }
};