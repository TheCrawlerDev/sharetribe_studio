/**
 * This file contains server side endpoints that can be used to perform backend
 * tasks that can not be handled in the browser.
 *
 * The endpoints should not clash with the application routes. Therefore, the
 * endpoints are prefixed in the main server where this file is used.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { deserialize } = require('./api-util/sdk');
const storeCacheVars = require('./api/cache/start');

const initiateLoginAs = require('./api/initiate-login-as');
const loginAs = require('./api/login-as');
const transactionLineItems = require('./api/transaction-line-items');
const initiatePrivileged = require('./api/initiate-privileged');
const transitionPrivileged = require('./api/transition-privileged');

const createUserWithIdp = require('./api/auth/createUserWithIdp');

const { authenticateFacebook, authenticateFacebookCallback } = require('./api/auth/facebook');
const { authenticateGoogle, authenticateGoogleCallback } = require('./api/auth/google');
const { calendarBlockedTimes, calendarCreateEvent } = require('./api/google/calendar');
const {
  getGooglePlaces,
  getGooglePlace,
  getGooglePlaceByCoord,
} = require('./api/google/maps-places');
const { googleOauthAcessByCode } = require('./api/google/google-oath-code');
const { qrCodeCreate } = require('./api/qrcode/qrcode');
const { clientTest } = require('./api/client-test');
const { Base64Encode } = require('base64-stream');

const fs = require('fs');
const https = require('https');
const getStat = require('util').promisify(fs.stat);
const cache = require('./api/cache');
const fetch = url => import('node-fetch').then(({ default: fetch }) => fetch(url));

const fileparser = require('./api/wave/fileparser');
const cachedVars = require('./api/cache/vars');
const axios = require('axios');
const { create_UUID } = require('./api-util/added');
const { blogAssets } = require('./api/google/blog-assets');
const { createSubscription } = require('./api/subscription-paywall');
const { createCheckoutSession } = require('./api/subscription-paywall/create-checkout-session');
const { accessCheckoutSession } = require('./api/subscription-paywall/access-checkout-session');
const { successCheckout } = require('./api/subscription-paywall/success-checkout');
const { watchedTutorial } = require('./api/tutorial');
const userQuery = require('./external-app/userQuery');
const { getUserMe, saveUserMe } = require('./api/userMe');

const router = express.Router();

// ================ API router middleware: ================ //

// Parse Transit body first to a string
router.use(
  bodyParser.text({
    type: 'application/transit+json',
  })
);

// Deserialize Transit body string to JS data
router.use((req, res, next) => {
  if (
    (req.get('Content-Type') === 'application/transit+json' &&
      typeof req.body === 'string' &&
      cache.get(cachedVars.TRANSITJSONENABLE)) ||
    cache.get(cachedVars.FORCE2TRANSITJSONENABLE)
  ) {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:');
      console.error(e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

// ================ API router endpoints: ================ //

router.get('/external-source-stream', async (req, res) => {
  https.get(req.query.url, stream => {
    if (req.query.type) {
      res.setHeader('content-type', req.query.type);
    }
    stream.pipe(res);
    // stream.pipe(new Base64Encode()).pipe(res);
  });
});

router.get('/initiate-login-as', initiateLoginAs);
router.get('/login-as', loginAs);
router.post('/transaction-line-items', transactionLineItems);
router.post('/initiate-privileged', initiatePrivileged);
router.post('/transition-privileged', transitionPrivileged);

// Create user with identity provider (e.g. Facebook or Google)
// This endpoint is called to create a new user after user has confirmed
// they want to continue with the data fetched from IdP (e.g. name and email)
router.post('/client-test', clientTest);
router.post('/auth/create-user-with-idp', createUserWithIdp);

// Facebook authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Facebook
router.get('/auth/facebook', authenticateFacebook);

// This is the route for callback URL the user is redirected after authenticating
// with Facebook. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/facebook/callback', authenticateFacebookCallback);

// Google authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Google
router.get('/auth/google', authenticateGoogle);

// This is the route for callback URL the user is redirected after authenticating
// with Google. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/google/callback', authenticateGoogleCallback);

router.get('/calendar/blocked-times/:userId', calendarBlockedTimes);

router.get('/places', getGooglePlaces);

router.get('/geocode', getGooglePlaceByCoord);

router.get('/place/:placeId', getGooglePlace);

router.get('/google/oauth-code', googleOauthAcessByCode);

router.get('/blog-api', blogAssets);

router.get('/create-checkout-session', createCheckoutSession);

router.get('/access-checkout-session', accessCheckoutSession);

router.get('/success-checkout', successCheckout);

router.get('/watched-tutorial', watchedTutorial);

router.get('/me/:username', async (req, res) => {
  await getUserMe(req.params.username)
    .then(data => {
      res.status(200).json({
        message: 'Success',
        data: data,
      });
    })
    .catch(error => {
      res.status(400).json({
        message: 'An error occurred.',
        error,
      });
    });
});

router.post('/me', async (req, res) => {
  console.log({ b: req.body });
  // await saveUserMe(req.body)
  await saveUserMe(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

// router.get('/create-subscription-paywall', createSubscription);

router.post('/slack-alert', async (req, res) => {
  console.log(req.body);
  let message = await axios.post(
    'https://hooks.slack.com/services/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',
    new URLSearchParams({
      payload: `{"channel": "${req.body.channel}", "username": "webhookbot", "text": "${req.body.message}"}`,
    })
  );
  return res.status(201).json({
    message: message.data,
  });
});

router.post('/upload-profile-songs', async (req, res) => {
  await fileparser(req, `musics/profile/${req.query.userId}.mp3`, 'audio/mp3')
    .then(data => {
      res.status(200).json({
        message: 'Success',
        data,
      });
    })
    .catch(error => {
      console.log('error', error);
      res.status(400).json({
        message: 'An error occurred.',
        error,
      });
    });
});

router.post('/upload-listing-terms', async (req, res) => {
  await fileparser(req, `terms/listing/${create_UUID()}.pdf`, 'application/pdf')
    .then(data => {
      res.status(200).json({
        message: 'Success',
        data,
      });
    })
    .catch(error => {
      console.log('error', error);
      res.status(400).json({
        message: 'An error occurred.',
        error,
      });
    });
});

router.get('/qrcode/create-qrcode', qrCodeCreate);

module.exports = router;
