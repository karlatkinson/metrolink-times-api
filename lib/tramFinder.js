const rp = require('request-promise');
const router = require('express').Router();
const tramTimes = require('./tramTimes');

function findTramsByDestination(stop, destination) {
    return tramTimes.getTramTimesForStation(stop)
        .then(trams => {
            return trams.filter(tram => tram.destination === destination)
        }).then(trams => {
            const filteredTrams = {
                [stop]: trams
            };
            return filteredTrams;
        });
}

router.get('/byDestination/:tram', (req, res, next) => {
    const requestedDestination = req.params.tram;
    const stations = req.app.get('stations');

    Promise.all(stations.map(station => findTramsByDestination(station.id, requestedDestination)))
        .then(trams => {
            return res.json(trams);
        }).catch(next);
});

module.exports = router;
