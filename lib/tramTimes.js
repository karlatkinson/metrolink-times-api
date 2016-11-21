const rp = require('request-promise');
const cheerio = require('cheerio');
const router = require('express').Router();
const cache = require('./cache');

function parseTramTimes($) {
    let times = [];

    $('#departure-items tr').each(function() {
        const destination = $(this).find('.departure-destination').text();
        const type = $(this).find('.departure-carriages span').first().text();
        const wait = $(this).find('.departure-wait').find('.figure').text();
        const unit = $(this).find('.departure-wait').find('.unit').text();

        times.push({
            destination,
            type,
            due: `${wait} ${unit}`
        })
    });

    return times;
}

function getTimesFromMetrolink(station) {
    console.log(`requesting times for ${station}`);
    const options = {
        uri: `https://beta.tfgm.com/public-transport/stations/${station}`,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function($) {
            const tramTimes = parseTramTimes($);
            return tramTimes;
        });
}

function getTramTimesForStation(station) {
    return new Promise((resolve, reject) => {
        let cachedTramTimes = cache.get(station);
        if (cachedTramTimes == undefined) {
            getTimesFromMetrolink(station).then(tramTimes => {
                if (tramTimes.length != 0) {
                    console.log(`Cached tram times for ${station}`)
                    cache.set(station, tramTimes, 30);
                }
                return resolve(tramTimes);
            });
        } else {
            return resolve(cachedTramTimes);
        }
    });
}

router.get('/:station', (req, res, next) => {
    let tramTimes = getTramTimesForStation(req.params.station)
        .then(tramTimes => res.json(tramTimes))
        .catch(next);
});

module.exports = {
    router,
    getTramTimesForStation
};
