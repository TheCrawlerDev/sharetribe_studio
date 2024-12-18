const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 0 });
cache.on( "expired", function( key, value ){
	cache.set(key, value);
});
module.exports = cache;
