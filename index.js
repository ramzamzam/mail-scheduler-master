"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const config = require('./config.json');
const app = express();

app.use(bodyParser.text());

const serviceDiscoveryRouter = require('./services/service-discovery').router;

const tokens = require('./lib/tokens');
const messages = require('./lib/messages');


app.post('/message/:email/:datetime', (req, res) => {
    messages.saveMessage(req.params.email, req.body, req.params.datetime)
        .then((result) => {
            const date = new Date(req.params.datetime);
            messages.scheduleMessage(result.id, date);
            tokens.updateTokens(req.body)
        })
        .then(() => res.status(200).end())
        .catch(err => {
            console.error(err);
            res.status(500).end(err.toString())
        });

});

app.get('/tokens/:limit?', (req, res) => {
    tokens.getTokens(req.params.limit)
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            return res.status(400).end(err);
        })
});

app.use('/register', serviceDiscoveryRouter);

app.listen(config.PORT, function () {
    messages.scheduleUnsentMessages()
        .catch(console.error);
});
