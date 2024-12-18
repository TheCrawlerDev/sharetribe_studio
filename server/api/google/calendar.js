const http = require('http');
const https = require('https');
const sharetribeSdk = require('sharetribe-flex-sdk');
const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');
const userShow = require('../../external-app/userShow');
const userUpdate = require('../../external-app/userUpdate');
const googleHttpIntegration = require('./google-http-integration');
var axios = require('axios');
var qs = require('qs');
const transactionsQuery = require('../../external-app/transactionsQuery');
const transactionsShow = require('../../external-app/transactionsShow');
const newTransition = require('../../external-app/transactionsUpdateMeta');
const { uuidv4 } = require('../../api-util/idToken');
const transactionsUpdateMetadata = require('../../external-app/transactionsUpdateMeta');

const TRANSITION_ACCEPTED = 'transition/accept';
const CALENDAR_CREATED_EVENT = 'transition/calendar';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_SDK_CLIENT_SECRET;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const rootUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};

const updateGCalendar = async function(id, protectedData, gCalendar) {
  return await userUpdate({
    id: id,
    protectedData: {
      ...protectedData,
      gCalendar: gCalendar,
    },
  });
};

const refreshedGCalendarWhenTokenIsExpired = async function(
  gCalendar,
  scope = 'https://www.googleapis.com/auth/calendar'
) {
  const expiresIn = gCalendar?.refresh_at?.in_seconds + gCalendar?.expires_in;
  if (expiresIn <= Math.ceil(new Date().getTime() / 1000)) {
    try {
      const responseToken = (await googleHttpIntegration.refreshedGCalendarWhenTokenIsExpired(
        gCalendar,
        scope
      )).data;
      const newGCalendar = {
        ...gCalendar,
        ...responseToken,
        refresh_at: {
          date: new Date().toISOString(),
          in_seconds: Math.ceil(new Date().getTime() / 1000),
          in_millis: new Date().getTime(),
        },
      };
      return { valid: true, refreshed: true, gCalendar: newGCalendar };
    } catch (error) {
      // console.log(error);
      return {
        valid: false,
        refreshed: false,
        gCalendar,
        reason: 'Google calendar refresh token request error',
      };
    }
  } else {
    return { valid: true, refreshed: false, gCalendar, reason: 'Token is valid' };
  }
};

const grantsIdFromCalendarWhenNotExists = async function(gCalendar) {
  if (!gCalendar.id) {
    try {
      const response = (await googleHttpIntegration.getCalendarIds(gCalendar)).data;
      const primary = response.items.filter(item => item.primary == true);
      return {
        valid: true,
        refreshed: true,
        id: primary.length > 0 ? primary[0]?.id : response.items[0].id,
        list: response.items.map(item => item.id),
      };
    } catch (error) {
      // console.log(error);
      return {
        valid: false,
        refreshed: false,
        id: null,
        reason: 'Google calendar request error',
      };
    }
  } else {
    return { valid: true, refreshed: false, id: gCalendar.id, reason: 'Is valid' };
  }
};

const grantsStudiobookIdFromCalendarWhenNotExists = async function(gCalendar) {
  if (!gCalendar.studiobookCalendarId) {
    try {
      const response = (await googleHttpIntegration.createCalendar(gCalendar, {
        summary: 'Studiobook',
        timeZone: 'America/Los_Angeles',
      })).data;
      return {
        valid: true,
        refreshed: true,
        studiobookCalendarId: response.id,
      };
    } catch (error) {
      // console.log(error);
      return {
        valid: false,
        refreshed: false,
        id: null,
        reason: 'Google calendar request error',
      };
    }
  } else {
    return { valid: true, refreshed: false, studiobookCalendarId: gCalendar.studiobookCalendarId, reason: 'Is valid' };
  }
};

const grantsCalendarIntegration = async function(userInfo) {
  const gCalendar = userInfo.data.data.attributes.profile.protectedData?.gCalendar || {};
  if (!gCalendar?.refresh_token) {
    return { valid: false, reason: 'Refresh token is required' };
  }
  const gCalendarTokenRefreshed = await refreshedGCalendarWhenTokenIsExpired(gCalendar);
  if (!gCalendarTokenRefreshed.valid) {
    return gCalendarTokenRefreshed;
  }
  const gCalendarIdRefreshed = await grantsIdFromCalendarWhenNotExists(
    gCalendarTokenRefreshed.gCalendar
  );
  const gCalendarStudiobookIdRefreshed = await grantsStudiobookIdFromCalendarWhenNotExists(
    gCalendarTokenRefreshed.gCalendar
  );
  if (!gCalendarIdRefreshed.valid) {
    return gCalendarIdRefreshed;
  }
  try {
    const newGCalendar = {
      id: gCalendarIdRefreshed.id,
      listIds: gCalendarIdRefreshed.list,
      studiobookCalendarId: gCalendarStudiobookIdRefreshed.studiobookCalendarId,
      ...gCalendarTokenRefreshed.gCalendar,
    };
    const updated = await updateGCalendar(
      userInfo.data.data.id,
      userInfo.data.data.attributes.profile.protectedData,
      newGCalendar
    );
    return { valid: true, gCalendar: newGCalendar, updated };
  } catch (error) {
    return {
      valid: false,
      gCalendar: gCalendar,
      reason: "We can't refresh the gCalendar values",
      updated: null,
    };
  }
};

const getCalendarEvents = async function(userInfo, timeMin, timeMax, timeZone = undefined) {
  const grantsCalendar = await grantsCalendarIntegration(userInfo);
  if (!grantsCalendar.valid) {
    delete grantsCalendar.gCalendar;
    delete grantsCalendar.id;
    return grantsCalendar;
  }
  try {
    const response = (await googleHttpIntegration.getCalendarEvents(
      grantsCalendar.gCalendar,
      timeMin,
      timeMax,
      timeZone
    )).data;

    return {
      valid: true,
      items: response.items.map(item => {
        return {
          kind: item.kind,
          id: item.id,
          status: item.status,
          created: item.created,
          updated: item.updated,
          start: item.start,
          end: item.end,
        };
      }),
    };
  } catch (error) {
    // console.log(error);
    return {
      valid: false,
      reason: "We can't get your calendar events",
    };
  }
};

const createCalendarEvent = async function(userInfo, event) {
  const grantsCalendar = await grantsCalendarIntegration(userInfo);
  if (!grantsCalendar.valid) {
    delete grantsCalendar.gCalendar;
    delete grantsCalendar.id;
    return grantsCalendar;
  }
  try {
    const response = (await googleHttpIntegration.createCalendarEvent(
      grantsCalendar.gCalendar,
      event
    )).data;

    return {
      valid: true,
      ...response,
    };
  } catch (error) {
    console.log(error);
    return {
      valid: false,
      reason: "We can't create a new calendar events",
    };
  }
};

exports.calendarBlockedTimes = async (req, res, next) => {
  let parameters = {
    id: req.params.userId,
  };
  userShow(parameters)
    .then(async showUserResult => {
      const googleCalendarEvents = await getCalendarEvents(
        showUserResult,
        req.query.timeMin,
        req.query.timeMax,
        req.query?.timeZone
      );
      return res
        .status(showUserResult.status)
        .set('Content-Type', 'application/json')
        .send({
          ok: googleCalendarEvents.valid,
          data: {
            ...googleCalendarEvents,
          },
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
          error: 'show-current-user-failed',
        })
        .end();
    });
};

exports.calendarCreateEvent = async () => {
  try {
    const transactionsResult = await transactionsQuery({});
    for await (const transaction of transactionsResult.data.data) {
      const transitionAccept = transaction.attributes.transitions.find(
        t => t.transition == TRANSITION_ACCEPTED
      );
      const calendarCreatedEvent = transaction.attributes.metadata?.createdEvent?.id;
      if (!!transitionAccept && !calendarCreatedEvent) {
        const transactionSimple = (await transactionsShow({ id: transaction.id.myOwnUuidValue }))
          .data;
        transactionSimple.relations = {
          customer: transactionSimple.included.find(
            s => s.id.myOwnUuidValue == transaction.relationships.customer.data.id.myOwnUuidValue
          ),
          provider: transactionSimple.included.find(
            s => s.id.myOwnUuidValue == transaction.relationships.provider.data.id.myOwnUuidValue
          ),
          listing: transactionSimple.included.find(
            s => s.id.myOwnUuidValue == transaction.relationships.listing.data.id.myOwnUuidValue
          ),
          booking: transactionSimple.included.find(
            s => s.id.myOwnUuidValue == transaction.relationships.booking.data.id.myOwnUuidValue
          ),
        };
        const event = {
          summary: `StudioBook booking of ${transactionSimple.relations.customer.attributes.profile.displayName}`,
          description: 'This event was created by studiobook.',
          start: {
            dateTime: transactionSimple.relations.booking.attributes.start,
            timeZone: transactionSimple.relations.listing.attributes.availabilityPlan.timezone,
          },
          end: {
            dateTime: transactionSimple.relations.booking.attributes.end,
            timeZone: transactionSimple.relations.listing.attributes.availabilityPlan.timezone,
          },
          attendees: [
            { email: transactionSimple.relations.provider.attributes.email },
            { email: transactionSimple.relations.customer.attributes.email },
          ],
          reminders: {
            useDefault: false,
            overrides: [{ method: 'email', minutes: 1440 }, { method: 'popup', minutes: 10 }],
          },
        };
        const createdEvent = await createCalendarEvent(
          { data: { data: transactionSimple.relations.provider } },
          event
        );
        if (!!createdEvent.id) {
          await transactionsUpdateMetadata({
            id: transactionSimple.data.id.myOwnUuidValue,
            metadata: {
              createdEvent: { id: createdEvent.id, htmlLink: createdEvent.htmlLink },
              ...transactionSimple.data.metadata,
            },
          });
        }
      }
      return true;
    }
  } catch (error) {
    console.error('created-event-by-transactions-error', error);
    return false;
  }
};
