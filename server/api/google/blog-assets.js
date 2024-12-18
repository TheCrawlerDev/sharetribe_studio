const http = require('http');
const https = require('https');
const sharetribeSdk = require('sharetribe-flex-sdk');
const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');
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

exports.blogAssets = (req, res, next) => {
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
  let { version, assetPath } = req.query;

  const fetchAssets = version
    ? sdk.assetByVersion({ path: assetPath, version })
    : sdk.assetByAlias({ path: assetPath, alias: 'latest' });

  fetchAssets
    .then(function(response) {
      return res
        .status(200)
        .set('Content-Type', 'application/json')
        .send({
          ok: true,
          ...response.data,
        })
        .end();
    })
    .catch(e => {
      // Make sure auth info is up to date
      // console.log(e);
      return res
        .status(404)
        .set('Content-Type', 'application/json')
        .send({
          ok: false,
          error: 'fetch-current-asset-failed',
        })
        .end();
    });
};
