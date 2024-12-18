const sdk = require('./auth.js');

const userUpdate = params =>
  sdk.users.updateProfile(params);

module.exports = userUpdate;
