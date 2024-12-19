// These helpers are calling this template's own server-side routes
// so, they are not directly calling Marketplace API or Integration API.
// You can find these api endpoints from 'server/api/...' directory

import defaultConfig from '../config/configDefault';
import appSettings from '../config/settings';
import { types as sdkTypes, transit } from './sdkLoader';
import Decimal from 'decimal.js';

export const GOOGLE_AUTH_COMPLETED = 'google_auth_completed';

export const apiBaseUrl = () => {
  const port = process.env.REACT_APP_DEV_API_SERVER_PORT;
  const useDevApiServer = process.env.NODE_ENV === 'development' && !!port;

  // In development, the dev API server is running in a different port
  if (useDevApiServer) {
    return `http://localhost:${port}`;
  }

  // Otherwise, use the same domain and port as the frontend
  return `${process.env.REACT_APP_MARKETPLACE_ROOT_URL}`;
};

export const getGoogleAuthUrl = from => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: from,
    client_id: defaultConfig.googleCalendar.config.clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: defaultConfig.googleCalendar.config.scope,
    state: GOOGLE_AUTH_COMPLETED,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

// Application type handlers for JS SDK.
//
// NOTE: keep in sync with `typeHandlers` in `server/api-util/sdk.js`
export const typeHandlers = [
  // Use Decimal type instead of SDK's BigDecimal.
  {
    type: sdkTypes.BigDecimal,
    customType: Decimal,
    writer: v => new sdkTypes.BigDecimal(v.toString()),
    reader: v => new Decimal(v.value),
  },
];

const serialize = data => {
  return transit.write(data, { typeHandlers, verbose: appSettings.sdk.transitVerbose });
};

const deserialize = str => {
  return transit.read(str, { typeHandlers });
};

const upload = (path, form) => {
  return window.fetch(`${apiBaseUrl()}${path}`, {
    method: 'POST',
    body: form,
  });
};

const post = (path, body) => {
  const url = `${apiBaseUrl()}${path}`;
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/transit+json',
    },
    body: serialize(body),
  };
  return window.fetch(url, options).then(res => {
    const contentTypeHeader = res.headers.get('Content-Type');
    const contentType = contentTypeHeader ? contentTypeHeader.split(';')[0] : null;

    if (res.status >= 400) {
      return res.json().then(data => {
        let e = new Error();
        e = Object.assign(e, data);

        throw e;
      });
    }
    if (contentType === 'application/transit+json') {
      return res.text().then(deserialize);
    } else if (contentType === 'application/json') {
      return res.json();
    }
    return res.text();
  });
};

const get = path => {
  const url = `${apiBaseUrl()}${path}`;
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/transit+json',
    },
  };
  return window.fetch(url, options).then(res => {
    if (res.status >= 400) {
      return res.json().then(data => {
        let e = new Error();
        e = Object.assign(e, data);

        throw e;
      });
    }
    return res.text().then(deserialize);
  });
};

const getExternal = url => {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {},
  };
  return window.fetch(url, options);
};

// Fetch transaction line items from the local API endpoint.
//
// See `server/api/transaction-line-items.js` to see what data should
// be sent in the body.
export const transactionLineItems = body => {
  return post('/api/transaction-line-items', body);
};

// Initiate a privileged transaction.
//
// With privileged transitions, the transactions need to be created
// from the backend. This endpoint enables sending the order data to
// the local backend, and passing that to the Marketplace API.
//
// See `server/api/initiate-privileged.js` to see what data should be
// sent in the body.
export const initiatePrivileged = body => {
  return post('/api/initiate-privileged', body);
};

// Transition a transaction with a privileged transition.
//
// This is similar to the `initiatePrivileged` above. It will use the
// backend for the transition. The backend endpoint will add the
// payment line items to the transition params.
//
// See `server/api/transition-privileged.js` to see what data should
// be sent in the body.
export const transitionPrivileged = body => {
  return post('/api/transition-privileged', body);
};

// Create user with identity provider (e.g. Facebook or Google)
//
// If loginWithIdp api call fails and user can't authenticate to Marketplace API with idp
// we will show option to create a new user with idp.
// For that user needs to confirm data fetched from the idp.
// After the confirmation, this endpoint is called to create a new user with confirmed data.
//
// See `server/api/auth/createUserWithIdp.js` to see what data should
// be sent in the body.
export const createUserWithIdp = body => {
  return post('/api/auth/create-user-with-idp', body);
};

export const slackAlert = (channel, message) => {
  return post('/api/slack-alert', { channel, message });
};

export const calendarBlockedTimes = (userId, timeMin, timeMax, timeZone) => {
  return get(
    `/api/calendar/blocked-times/${userId}?timeZone=${timeZone}&timeMin=${timeMin}&timeMax=${timeMax}`
  );
};

export const accessCheckoutSession = () => {
  return get(`/api/access-checkout-session`);
};

export const successCheckout = (session, plan) => {
  return get(`/api/success-checkout?session=${session}&plan=${plan}`);
};

export const watchedTutorial = () => {
  return get(`/api/watched-tutorial`);
};

export const blogApiByVersion = (assetPath, version) => {
  return get(`/api/blog-api?version=${version}&assetPath=${assetPath}`);
};

export const blogApiByAlias = assetPath => {
  return get(`/api/blog-api?assetPath=${assetPath}`);
};

export const googlePlaces = search => {
  return get(`/api/places?search=${search}`);
};

export const googlePlace = id => {
  return get(`/api/place/${id}`);
};

export const googlePlaceByCoords = (lat, lng) => {
  return get(`/api/geocode?lat=${lat}&lng=${lng}`);
};

export const googleAuthByCode = (code, redirect_uri) => {
  return get(`/api/google/oauth-code?code=${code}&redirect_uri=${redirect_uri}`);
};

export const createQrCode = (url) => {
  return get(`/api/qrcode/create-qrcode?url=${url}`);
};

export const createCheckoutSession = plan => {
  return get(`/api/create-checkout-session?plan=${plan}`);
};

export const getMe = username => {
  return get(`/api/me/${username}`);
};

export const saveUsernameMe = customer => {
  return post(`/api/me`, { username: customer.username, uuid: customer.uuid });
};

export const createProfileSong = (userId, form) => {
  return upload(`/api/upload-profile-songs?userId=${userId}`, form);
};

export const createListingTerms = form => {
  return upload(`/api/upload-listing-terms`, form);
};

export const apiExternalFiles = (url, transform = true, type = false) => {
  if (!transform) {
    return getExternal(url);
  } else if (!!type) {
    return getExternal(baseApiExternalFilesForceType(url, type));
  } else {
    return getExternal(baseApiExternalFiles(url));
  }
};

export const baseApiExternalFiles = url => {
  return `${apiBaseUrl()}/api/external-source-stream?url=${url}`;
};

export const baseApiExternalFilesForceType = (url, type) => {
  return `${apiBaseUrl()}/api/external-source-stream?url=${url}&type=${type}`;
};
