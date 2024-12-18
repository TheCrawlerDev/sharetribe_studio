const STRIPE_KEY = process.env.STRIPE_SK_KEY;
const stripe = require('stripe')(STRIPE_KEY);
module.exports = stripe;