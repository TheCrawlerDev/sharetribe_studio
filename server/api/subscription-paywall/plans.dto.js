const SubscriptionPaidPlansEnum = require('./plans.enum');

exports.plansModel = [
  { name: SubscriptionPaidPlansEnum.START, price: 1000, interval: 'month', label: 'Premium', code: '886b79ab-9d99-4601-94a9-183bbf86ec62'},
  { name: SubscriptionPaidPlansEnum.ADVANCED, price: 10000, interval: 'year', label: 'Premium Plus', code: '8d956c17-eccd-4832-8fdc-641c45e78cf2'},
];

