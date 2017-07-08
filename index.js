"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.json');
const app = express();
app.use(require('request-ip').mw());
app.use(bodyParser.text());
const {senders, tokenizers} = require('./service-discovery');
const serviceDiscoveryRouter = require('./service-discovery').router;

app.post('/message/:email/:datetime', (req, res) => {
    senders
        .next()
        .sendMessage(req.params.email, req.body)
        .then(() => {
            console.log('sended');
            return res.status(200).end();
        })
        .catch(console.error);
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