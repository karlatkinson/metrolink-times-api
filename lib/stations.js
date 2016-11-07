const rp = require('request-promise');
const cheerio = require('cheerio');
const router = require('express').Router();
const NodeCache = require("node-cache");
const cache = new NodeCache({
    stdTTL: 30,
    checkperiod: 120
});

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
        })
        .catch(function(err) {
            return next(err);
        });
}

router.get('/:station', (req, res, next) => {

    let cachedTramTimes = cache.get(req.params.station);
    if (cachedTramTimes == undefined) {
        getTimesFromMetrolink(req.params.station).then(tramTimes => {
            if (tramTimes.length != 0) {
                console.log(`Cached tram times for ${req.params.station}`)
                cache.set(req.params.station, tramTimes, 30);
            }

            cachedTramTimes = tramTimes;
        });
    }

    return res.json(cachedTramTimes);
});

module.exports = router;
