"use strict";

module.exports = function(f) {
  return async function(req, res, next) {
    try {
      await f(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};