var express = require('express');
//var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    return res.json({ status: 'nothing to see here....'});
});

app.get('/api/stations/:station', function(req, res) {

    var options = {
        uri: `https://beta.tfgm.com/public-transport/stations/${req.params.station}`,
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    var times = [];

    rp(options)
        .then(function($) {
            $('#departure-items tr').each(function() {
                let destination = $(this).find('.departure-destination').text();
                let type = $(this).find('.departure-carriages span').first().text();
                var wait = $(this).find('.departure-wait').find('.figure').text();
                var unit = $(this).find('.departure-wait').find('.unit').text();

                times.push({
                    destination,
                    type,
                    due: `${wait} ${unit}`
                })
            });

            return res.json(times);
        })
        .catch(function(err) {
            return res.json(err);
        });
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

exports = module.exports = app;
