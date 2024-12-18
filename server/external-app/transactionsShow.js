const sdk = require('./auth.js');

const transactionsShow = params =>
  sdk.transactions.show({
    ...params,
    include: [
      'customer',
      'provider',
      'listing',
      'booking',
    ],
  });

module.exports = transactionsShow;
