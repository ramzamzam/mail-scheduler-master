"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.json');
const app = express();
app.use(bodyParser.text());
const serviceDiscoveryRouter = require('./service-discovery').router;

app.post('/message/:email/:datetime', (req, res) => {
    return res.json({params : req.params, body : req.body});
});

app.get('/tokens', (req, res) => {
    return res.json([
        'a',
        'b',
        'c',
        'd',
        'e'
    ])
});

app.use('/register', serviceDiscoveryRouter);

app.listen(config.PORT);