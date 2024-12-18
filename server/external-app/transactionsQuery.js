const sdk = require('./auth.js');

const transactionsQuery = params =>
  sdk.transactions.query({
    ...params,
    include: [
      'customer',
      'provider',
      'listing',
      'booking',
    ],
  });

module.exports = transactionsQuery;
