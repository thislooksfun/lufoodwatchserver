"use strict";

class MissingParameterError extends Error {
  constructor(param) {
    super("Missing parameter: '" + param + "'");
    this.param = param;
    Error.captureStackTrace(this, this.constructor);
  }
}

class InvalidParameterTypeError extends Error {
  constructor(param, expected, actual) {
    super("Invalid parameter type for: '" + param + "'; expected '" + expected + "', got '" + actual + "'");
    this.param = param;
    this.expected = expected;
    this.actual = actual;
    Error.captureStackTrace(this, this.constructor);
  }
}

function verify(param, name, expected) {
  // TODO: Handle multiple allowed types?
  // let validTypes = expected.split("|").map((i) => i.trim());
  
  // Ensure field is present
  if (param == null) {
    throw new MissingParameterError(name);
  }
  
  // TODO: Handle special cases (like 'array')
  if (typeof param !== expected) {
    throw new InvalidParameterTypeError(name, expected, typeof param);
  }
}

verify.MissingParameterError = MissingParameterError;
verify.InvalidParameterTypeError = InvalidParameterTypeError;

module.exports = verify;