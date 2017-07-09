"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const config = require('./config.json');
const app = express();

app.use(require('request-ip').mw());
app.use(bodyParser.text());

const {senders, tokenizers} = require('./service-discovery');
const serviceDiscoveryRouter = require('./service-discovery').router;
const db = require('./services/db');
const getTokens = require('./services/get-tokens');

function getMessage(id) {
    return new Promise((resolve, reject) => {
        const getMessageQuery = 'select email, text from messages where id = $(id)';
        db.one(getMessageQuery, {id})
            .then(resolve)
            .catch(reject);
    })
}

function saveMessage(email, text, datetime) {
    return new Promise((resolve, reject) => {
        const save_message_query = 'insert into messages (text, email, send_date)' +
            'values ($(text), $(email), $(datetime)) returning id::text';
        db.one(save_message_query, {
            email,
            datetime,
            text
        })
            .then(resolve)
            .catch(reject);
    })
}

function sendMessasge(email, text) {
    return new Promise((resolve, reject) => {
        const sender = senders.next();
        if (sender) {
            resolve(sender.sendMessage(email, text));
        } else {
            reject(new Error('Sender not found!'));
        }
    })

}

function updateTokens(text) {
    return new Promise((resolve, reject) => {
        const tokenizer = tokenizers.next();
        if(tokenizer) {
            resolve(tokenizer.updateTokens(text));
        } else {
            reject(new Error('Tokenizer not found!'));
        }
    })
}

app.post('/message/:email/:datetime', (req, res) => {
    saveMessage(req.params.email, req.body, req.params.datetime)
        .then((result) => {
            const date = new Date(req.params.datetime);
            console.log(date);
            if(date.getTime() > new Date().getTime()) {
                schedule.scheduleJob(date, function () {
                    getMessage(result.id)
                        .then(message => sendMessasge(message.email, message.text))
                        .catch(err => {
                            console.error(err);
                        })
                })
            } else {
                return sendMessasge(req.params.email, req.body);
            }
        })
        .then(() => updateTokens(req.body))
        .then(() => res.status(200).end())
        .catch(err => {
            console.error(err);
            res.status(500).end(err.toString())
        });

});

app.get('/tokens/:limit?', (req, res) => {
    getTokens(req.params.limit)
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            return res.status(400).end(err);
        })
});

app.use('/register', serviceDiscoveryRouter);

app.listen(config.PORT);