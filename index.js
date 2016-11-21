const express = require('express');
const errorHandler = require('./lib/errorHandler');
const stations = require('./lib/stations');
const app = express();
const port = process.env.PORT || 5000;

app.use('/', require('./lib/status'));
app.use('/find/trams', require('./lib/tramFinder'));
app.use('/api/stations', require('./lib/tramTimes'));
app.use(errorHandler);

stations.getStations('tram').then(tramStations => {
    app.set('stations', tramStations);

    app.listen(port, () => {
        console.log('Node app is running on port', port);
    });
});

exports = module.exports = app;
