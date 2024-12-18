var axios = require('axios');
var qs = require('qs');
const { config } = require('../../external-app/configGoogleCalendar');
const GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
const GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';

const googleOauth = async params => {
  return await axios({
    method: 'post',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    maxRedirects: 0,
    data: qs.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      ...params,
    }),
  });
};

exports.googleOauthAcessByCode = async (code, redirect_uri) =>
  await googleOauth({
    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
    code: code,
    redirect_uri: redirect_uri,
  });

exports.refreshedGCalendarWhenTokenIsExpired = async (
  gCalendar,
  scope = 'https://www.googleapis.com/auth/calendar'
) =>
  await googleOauth({
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    refresh_token: gCalendar?.refresh_token,
    scope: scope,
  });

exports.getCalendarIds = async gCalendar =>
  await axios({
    method: 'get',
    url: `https://www.googleapis.com/calendar/v3/users/me/calendarList/?access_token=${gCalendar.access_token}`,
    headers: {},
    maxRedirects: 0,
  });

exports.getCalendarEvents = async (gCalendar, timeMin, timeMax, timeZone = undefined) => {
  // console.log({
  //   method: 'get',
  //   url: `https://www.googleapis.com/calendar/v3/calendars/${encodeURI(
  //     gCalendar.id
  //   )}/events?access_token=${gCalendar.access_token}
  //       &timeMin=${timeMin}T00:30:00-03:00&timeMax=${timeMax}T23:30:00-03:00&timeZone=${timeZone}`,
  //   headers: {},
  //   maxRedirects: 0,
  // });
  return await axios({
    method: 'get',
    url: `https://www.googleapis.com/calendar/v3/calendars/${encodeURI(
      gCalendar.id
    )}/events?access_token=${gCalendar.access_token}
        &timeMin=${timeMin}T00:30:00-03:00&timeMax=${timeMax}T23:30:00-03:00&timeZone=${timeZone}`,
    headers: {},
    maxRedirects: 0,
  });
};
exports.createCalendarEvent = async (gCalendar, event) =>
  await axios({
    method: 'post',
    url: `https://www.googleapis.com/calendar/v3/calendars/${encodeURI(
      gCalendar.studiobookCalendarId
    )}/events?access_token=${gCalendar.access_token}`,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
    data: JSON.stringify(event),
  });

exports.createCalendar = async (gCalendar, calendarDetails) =>
  await axios({
    method: 'post',
    url: `https://www.googleapis.com/calendar/v3/calendars?access_token=${gCalendar.access_token}`,
    headers: {
      'Content-Type': 'application/json',
    },
    maxRedirects: 0,
    data: JSON.stringify(calendarDetails),
  });
