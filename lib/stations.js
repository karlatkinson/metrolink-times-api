var rp = require('request-promise');
var cheerio = require('cheerio');
var router = require('express').Router();

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

router.get('/:station', (req, res, next) => {

    const options = {
        uri: `https://beta.tfgm.com/public-transport/stations/${req.params.station}`,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    rp(options)
        .then(function($) {
            const tramTimes = parseTramTimes($);

            return res.json(tramTimes);
        })
        .catch(function(err) {
            return next(err);
        });
});

module.exports = router;
