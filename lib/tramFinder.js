const rp = require('request-promise');
const router = require('express').Router();

function findTramsByDestination(stop, destination) {
    var options = {
        uri: `http://localhost:5000/api/stations/${stop}`,
        json: true
    };

    return rp(options)
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
        });
});

module.exports = router;
