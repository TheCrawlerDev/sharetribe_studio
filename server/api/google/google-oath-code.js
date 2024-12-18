const http = require('http');
const https = require('https');
const sharetribeSdk = require('sharetribe-flex-sdk');
const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');
const googleHttpIntegration = require('./google-http-integration');
var axios = require('axios');
var qs = require('qs');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_SDK_CLIENT_SECRET;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const rootUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};

exports.googleOauthAcessByCode = (req, res, next) => {
  const tokenStore = sharetribeSdk.tokenStore.expressCookieStore({
    clientId: CLIENT_ID,
    req,
    res,
    secure: USING_SSL,
  });

  const sdk = sharetribeSdk.createInstance({
    transitVerbose: TRANSIT_VERBOSE,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    httpAgent,
    httpsAgent,
    tokenStore,
    typeHandlers,
    ...baseUrl,
  });
  let parameters = {
    id: req.params.userId,
  };
  sdk.currentUser
    .show({})
    .then(response => {
      googleHttpIntegration
        .googleOauthAcessByCode(req.query.code, req.query.redirect_uri)
        .then(function(response) {
          res
            .status(200)
            .set('Content-Type', 'application/json')
            .send({
              ok: true,
              data: response.data,
            })
            .end();
        })
        .catch(function(error) {
          // console.log(error);
          res
            .status(402)
            .set('Content-Type', 'application/json')
            .send({
              ok: false,
              error: 'google-request-failed',
            })
            .end();
        });
    })
    .catch(e => {
      // Make sure auth info is up to date
      // console.log(e);
      res
        .status(404)
        .set('Content-Type', 'application/json')
        .send({
          ok: false,
          error: 'fetch-current-user-failed',
        })
        .end();
    });
};
