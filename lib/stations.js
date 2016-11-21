const rp = require('request-promise');

function getStations(mode) {
    var options = {
        uri: `http://beta.tfgm.com/api/public-transport/stations/`,
        json: true
    };

    return rp(options).then(body => body.filter(station => station.mode === mode));
}

module.exports = {
    getStations
}
