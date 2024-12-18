const cacheVars = require('./info.json');
const cache = require('.');
const keys = Object.keys(cacheVars);
for (let index = 0; index < keys.length; index++) {
  const key = keys[index];
  const cacheVar = cacheVars[key];
  cache.set(key, cacheVar);
}
exports.module = cache.keys();
