const stripe = require('./stripe.connection');
const plansDto = require('./plans.dto');
const STRIPE_DYNAMO_HOSTING = process.env.STRIPE_DYNAMO_HOSTING;
const ROOT_URL = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
// const client = new DynamoDBClient({ region: 'us-east-1' });
// const docClient = DynamoDBDocumentClient.from(client);

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

const createProductOrFound = async productData => {
  let products = (await stripe.products.search({
    query: `active:\'true\' AND metadata[\'code\']:\'${productData.metadata.code}\'`,
  })).data;
  let product = products.length > 0 ? products[0] : {};
  if (!!product.id) {
    return product;
  }
  try {
    return stripe.products.create(productData);
  } catch (error) {
    console.log("Subscription Paywall error. Can't create a product on stripe.");
    console.log(error);
    return false;
  }
};

const createPriceOrFound = async priceData => {
  let prices = (await stripe.prices.search({
    query: `active:\'true\' AND product:\'${priceData.product}\'`,
  })).data;
  let price = prices.length > 0 ? prices[0] : {};
  if (!!price.id) {
    return price;
  }
  try {
    return stripe.prices.create(priceData);
  } catch (error) {
    console.log("Subscription Paywall error. Can't create a price on stripe.");
    console.log(error);
    return false;
  }
};

const createCheckoutSession = async checkoutData => {
  try {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      customer: checkoutData.customer,
      line_items: [
        {
          price: checkoutData.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${ROOT_URL}/subscriptions-plans?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${checkoutData.plan}`,
      cancel_url: `${ROOT_URL}/subscriptions-plans?canceled=true&plan=${checkoutData.plan}`,
    });
    return session;
  } catch (error) {
    console.log("Subscription Paywall error. Can't create a price on stripe.");
    console.log(error);
    return false;
  }
}

exports.checkoutCustomer = async (customerDetails, planDetails) => {
  const customer = await createCustomerOrFound({
    name: customerDetails.name,
    email: customerDetails.email,
    metadata: { customer_id: customerDetails.id },
  });
  const product = await createProductOrFound({
    name: planDetails.label,
    metadata: planDetails,
    description: planDetails.label
  });
  const price = await createPriceOrFound({
    product: product.id,
    unit_amount: planDetails.price,
    currency: 'usd',
    recurring: {
      interval: planDetails.interval,
    }
  });
  const checkout = await createCheckoutSession({ customer: customer.id, price: price.id, plan: planDetails.name });
  // var params = {
  //   TableName: `customer_subscriptions_${STRIPE_DYNAMO_HOSTING}`,
  //   Item: {
  //     id: customerDetails.id,
  //     stripeCustomerId: customer.id,
  //     customer,
  //     product,
  //     price,
  //     checkout,
  //     stage: 1
  //   },
  // };

  // const command = new PutCommand(params);

  // const op = await docClient.send(command);
  return { customer, product, price, checkout };
}

exports.getSession = async (session) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(session);  
  return checkoutSession;
}

exports.createSessionCustomer = async (customer) => {
  // const checkoutSession = await stripe.checkout.sessions.retrieve(session);
  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = `${ROOT_URL}/subscriptions-plans`;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer,
    return_url: returnUrl,
  });
  return portalSession;
}

exports.cancelSubscription = async (session) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(session);
  try {
    const subscriptionCancelled = await stripe.subscriptions.cancel(
      checkoutSession.subscription
    );
    return subscriptionCancelled;
  } catch (error) {
    return false;
  }
}


