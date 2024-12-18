const http = require('http');
const https = require('https');
const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');
var axios = require('axios');
var qs = require('qs');
const { uuidv4 } = require('../../api-util/idToken');
const QRCode = require('qrcode');
const { S3 } = require('@aws-sdk/client-s3');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_SDK_CLIENT_SECRET;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const rootUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;
var fs = require('fs');

const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};

exports.wave = async (req, res) => {
  fs.readFile('example.mp3', function(err, data) {
    return res
      .status(200)
      .set('Content-Type', 'audio/mpeg')
      .send(data)
      .end();
  });
};

exports.upload = async (req, res) => {
  const fileparser = require('./fileparser_old');
  await fileparser(req)
    .then(data => {
      res.status(200).json({
        message: 'Success',
        data,
      });
    })
    .catch(error => {
      res.status(400).json({
        message: 'An error occurred.',
        error,
      });
    });
};
