const Promise = require('core-js/es6/promise');

module.exports = class PromiseShim extends Promise {
  constructor(executor) {
    super(executor);
  }
}
