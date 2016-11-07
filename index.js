const express = require('express');
const errorHandler = require('./lib/errorHandler');
const app = express();
const port = process.env.PORT || 5000;

app.use('/', require('./lib/status'));
app.use('/api/stations', require('./lib/stations'));
app.use(errorHandler);

app.listen(port, () => {
    console.log('Node app is running on port', port);
});

exports = module.exports = app;
