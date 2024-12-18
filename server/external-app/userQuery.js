const sdk = require('./auth.js');

const userQuery = params =>
  sdk.users.query(params);

module.exports = userQuery;
