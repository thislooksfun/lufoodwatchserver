"use strict";

module.exports = {
  MissingParameterError: class extends Error {
    constructor(param) {
      super("Missing parameter: '" + param + "'");
      this.param = param;
      Error.captureStackTrace(this, this.constructor);
    }
  },
  
  InvalidParameterTypeError: class extends Error {
    constructor(param, expected, actual) {
      super("Invalid parameter type for: '" + param + "'; expected '" + expected + "', got '" + actual + "'");
      this.param = param;
      this.expected = expected;
      this.actual = actual;
      Error.captureStackTrace(this, this.constructor);
    }
  }
};