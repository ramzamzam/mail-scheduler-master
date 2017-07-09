"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.json');
const app = express();

app.use(bodyParser.text());

const serviceDiscoveryRouter = require('./services/service-discovery').router;

const tokens = require('./lib/tokens');
const messages = require('./lib/messages');

/**
 * Register message for delievery on particulat date
 * email - destination email eddress
 * datetime - Date in extended ISO 8601 format
 */
app.post('/message/:email/:datetime', (req, res) => {
    messages.saveMessage(req.params.email, req.body, req.params.datetime)
        .then((result) => {
            const date = new Date(req.params.datetime);
            messages.scheduleMessage(result.id, date);
            tokens.updateTokens(req.body)
        })
        .then(() => res.status(200).end())
        .catch(err => {
            console.error(new Error(err));
            res.status(500).end(err.toString())
        });

});

/**
 * Obtain 10 (or any other number id limit is provided) most used tokens
 */
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
    // During startup we schedule unsent message (in case of server restart)
    messages.scheduleUnsentMessages()
        .catch(console.error);
});
