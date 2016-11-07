var rp = require('request-promise');
var cheerio = require('cheerio');
var router = require('express').Router();

router.get('/:station', function (req, res, next) {

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
              var destination = $(this).find('.departure-destination').text();
              var type = $(this).find('.departure-carriages span').first().text();
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
          return next(err);
      });
});

module.exports = router;
