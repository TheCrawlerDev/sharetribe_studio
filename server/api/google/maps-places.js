var axios = require('axios');
let GOOGLE_CLIENT_KEY = process.env.GOOGLE_CLIENT_KEY;

exports.getGooglePlaceByCoord = (req, res, next) => {
  let queryParams = [
    'fields=address_component,adr_address,business_status,formatted_address,geometry,name,place_id,plus_code,type',
    'result_type=locality',
    `latlng=${req.query.lat} ${req.query.lng}`,
    `key=${GOOGLE_CLIENT_KEY}`,
  ];
  axios({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/geocode/json?${queryParams.join('&')}`,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
  })
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
      res
        .status(402)
        .set('Content-Type', 'application/json')
        .send(
          {
            ok: false,
            error: 'google-request-failed',
          }
        )
        .end();
    });
};

exports.getGooglePlaces = (req, res, next) => {
  let queryParams = [
    'fields=address_component,adr_address,business_status,formatted_address,geometry,name,place_id,plus_code,type',
    'types=%28cities%29',
    'language=en',
    `input=${encodeURI(req.query.search)}`,
    `key=${GOOGLE_CLIENT_KEY}`,
  ];
  axios({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?${queryParams.join('&')}`,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
  })
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
      res
        .status(402)
        .set('Content-Type', 'application/json')
        .send(
          {
            ok: false,
            error: 'google-request-failed',
          }
        )
        .end();
    });
};

exports.getGooglePlace = (req, res, next) => {
  let queryParams = [`place_id=${req.params.placeId}`, `key=${GOOGLE_CLIENT_KEY}`];
  axios({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/details/json?${queryParams.join('&')}`,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
  })
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
      res
        .status(402)
        .set('Content-Type', 'application/json')
        .send({
          ok: false,
          error: 'google-request-failed',
        })
        .end();
    });
};
