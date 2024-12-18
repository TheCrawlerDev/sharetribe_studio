const sdk = require('./auth.js');

const transactionsUpdateMetadata = params => sdk.transactions.updateMetadata(params);

module.exports = transactionsUpdateMetadata;
