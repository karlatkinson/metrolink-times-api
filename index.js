const express = require('express');
const errorHandler = require('./lib/errorHandler');
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    return res.json({
        status: 'nothing to see here....'
    });
});

app.use('/', require('./lib/status'));
app.use('/api/stations', require('./lib/stations'));
app.use(errorHandler);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

exports = module.exports = app;
