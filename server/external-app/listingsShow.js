const sdk = require('./auth.js');

const listingsShow = params => sdk.listings.show(params);

module.exports = listingsShow;
