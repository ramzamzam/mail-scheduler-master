"use strict";
const router = require('express').Router();
const services = require('./services');

const senders = new services.ServiceArray();
const tokenizers = new services.ServiceArray();

router.get('/:type', (req, res) => {
    const {type} = req.params;
    const newServiceAddress = req.protocol + '://' +req.headers.host;
    let servicesStorage;
    let serviceClass;
    if(type === 'sender') {
        servicesStorage = senders;
        serviceClass = services.SenderService;
    }
    if(type === 'tokenizer') {
        servicesStorage = tokenizers;
        serviceClass = services.TokenizerService;
    }

    if(servicesStorage && serviceClass) {
        servicesStorage.push(new serviceClass(newServiceAddress));
        return res.status(200).end();
    } else {
        return res.status(400).end('Unknown service type');
    }
});


module.exports = {
    router,
    senders,
    tokenizers
};

