"use strict";

const wrap = pquire("lib/util/wrap");
const codes = pquire("lib/util/httpCodes");
const db = pquire("lib/api/v1/database");
// const email = pquire("lib/api/v1/notify/email");

const { MissingParameterError, InvalidParameterTypeError } = pquire("lib/util/errors");
const DuplicateUserError = db.DuplicateUserError;



async function post(req, res) {
  try {
    await db.signUp(req.body.email, req.body.password);
    res.status(codes.ok).send("Success!");
  } catch (e) {
    if (e instanceof MissingParameterError || e instanceof InvalidParameterTypeError || e instanceof DuplicateUserError) {
      res.status(codes.bad_request).send(e.message);
    } else {
      throw e;
    }
  }
  
  
  // await email.send({to: req.body.email, subject: "Hello there!", text: "It works! Huzzah!"});
  
  
  // res.json({hello: (await password.hash(req.body.email)).length});
}

module.exports = {
  setupRoutes(r) {
    r.route("/signup").post(wrap(post));
  }
};