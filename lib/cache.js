const NodeCache = require("node-cache");
const cache = new NodeCache({
    stdTTL: 30,
    checkperiod: 120
});

function get(key) {
    return cache.get(key);
}

function set(key, value, cacheTime) {
    cache.set(key, value, cacheTime);
}

module.exports = {
    get,
    set
}
