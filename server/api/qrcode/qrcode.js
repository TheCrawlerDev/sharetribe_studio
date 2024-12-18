const http = require('http');
const https = require('https');
const sharetribeSdk = require('sharetribe-flex-sdk');
const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');
const userShow = require('../../external-app/userShow');
const userUpdate = require('../../external-app/userUpdate');
var axios = require('axios');
var qs = require('qs');
const transactionsQuery = require('../../external-app/transactionsQuery');
const transactionsShow = require('../../external-app/transactionsShow');
const newTransition = require('../../external-app/transactionsUpdateMeta');
const { uuidv4 } = require('../../api-util/idToken');
const transactionsUpdateMetadata = require('../../external-app/transactionsUpdateMeta');
const QRCode = require('qrcode');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_SDK_CLIENT_SECRET;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const rootUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};

exports.qrCodeCreate = async (req, res) => {
  try {
    let QRbase64 = await new Promise((resolve, reject) => {
      QRCode.toDataURL(`${req.query?.url}`, function(
        err,
        code
      ) {
        if (err) {
          reject(reject);
          return;
        }
        resolve(code);
      });
    });
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .send({
        ok: true,
        qr: QRbase64,
      })
      .end();
    return QRbase64;
  } catch (error) {
    console.error('created-qrcode-error', error);
    res
      .status(400)
      .set('Content-Type', 'application/json')
      .send({
        ok: false,
      })
      .end();
  }
};
