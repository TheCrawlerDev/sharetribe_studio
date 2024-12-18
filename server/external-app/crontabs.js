var cron = require('node-cron');
const { calendarCreateEvent } = require('../api/google/calendar');
const cache = require('../api/cache');
const cachedVars = require('../api/cache/vars');

const gCalendarCreateEvents = cron.schedule(
  '*/5 * * * *', // token expires in almost 5 minutes
  () => {
    if(cache.get(cachedVars.CRONTABS)){
      console.info('Create Events by Transactions is running');
      calendarCreateEvent();
    }
  },
  {
    scheduled: true,
  }
);

const tasks = {
  gCalendarCreateEvents,
};

module.exports = tasks;