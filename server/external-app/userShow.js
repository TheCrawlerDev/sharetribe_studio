const sdk = require('./auth.js');

const userShow = params =>
  sdk.users.show(params);

module.exports = userShow;
