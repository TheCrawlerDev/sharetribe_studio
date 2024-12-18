exports.config = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scope: [
    'https://www.googleapis.com/auth/calendar.app.created',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    'https://www.googleapis.com/auth/calendar.events.freebusy',
    'https://www.googleapis.com/auth/calendar.events.public.readonly',
    'https://www.googleapis.com/auth/calendar.freebusy',
    // 'https://www.googleapis.com/auth/calendar',
    // 'https://www.googleapis.com/auth/calendar.events',
    // 'https://www.googleapis.com/auth/calendar.events.readonly',
    // 'https://www.googleapis.com/auth/calendar.readonly',
  ].join(' '),
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
};
