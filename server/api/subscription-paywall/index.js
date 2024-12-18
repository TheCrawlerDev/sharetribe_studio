const stripe = require('stripe')(
  'sk_test_51Nyb38HY6N2ABFBYV8ePc4S6RSn3spA1rCT90EKeSdPIXGvdnAy8MenPLnDkDgbv3frcOEz3nwQpj8ECjajs0ufD00uA1XXdMp'
);
const productPrice = 'price_1OYbLiHY6N2ABFBY7dmfgW3q';

const createCustomerOrFound = async customerData => {
  let customers = (await stripe.customers.search({
    query: `email:\'${customerData.email}\'`,
  })).data;
  let customer = customers.length > 0 ? customers[0] : {};
  if (!!customer.id) {
    return customer;
  }
  try {
    return await stripe.customers.create(customerData);
  } catch (error) {
    console.log("Subscription Paywall error. Can't create a customer on stripe.");
    console.log(error);
    return false;
  }
};

const createSubscriptionOrFound = async subscriptionData => {
  let subscriptions = (await stripe.subscriptions.search({
    query: `status:\'active\' AND metadata[\'customer_id\']:\'${subscriptionData.metadata.customer_id}\'`,
  })).data;
  let subscription = subscriptions.length > 0 ? subscriptions[0] : {};
  if (!!subscription.id) {
    return subscription;
  }
  try {
    return stripe.subscriptions.create(subscriptionData);
  } catch (error) {
    console.log("Subscription Paywall error. Can't create a customer on stripe.");
    console.log(error);
    return false;
  }
};

const getInvoice = async (invoiceId) => {
  return await stripe.invoices.sendInvoice(invoiceId);
}

exports.createSubscription = async (req, res, next) => {
  let customer = await createCustomerOrFound({
    name: 'Alexandre Matos',
    email: 'pubblicawebbots@gmail.com',
    metadata: { customer_id: '21312483295823' },
  });

  if (!customer) {
    return res
      .status(404)
      .set('Content-Type', 'application/json')
      .send({
        ok: false,
        message: "Can't create a customer on stripe.",
      })
      .end();
  }

  // store the customer id inside sharetribe flex

  let subscription = await createSubscriptionOrFound({
    customer: customer.id,
    collection_method: 'send_invoice',
    days_until_due: 0,
    items: [
      {
        price: productPrice,
      },
    ],
    metadata: { customer_id: '21312483295823' },
  });

  if (!subscription) {
    return res
      .status(404)
      .set('Content-Type', 'application/json')
      .send({
        ok: false,
        message: "Can't create a subscribe on stripe.",
      })
      .end();
  }

  let latestInvoice = await getInvoice(subscription.latest_invoice);

  return res
    .status(200)
    .set('Content-Type', 'application/json')
    .send({
      ok: true,
      customer,
      subscription,
      latestInvoice,
    })
    .end();
};
