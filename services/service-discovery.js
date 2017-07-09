"use strict";
const router = require('express').Router();
const services = require('./index');

const senders = new services.ServiceArray();
const tokenizers = new services.ServiceArray();

router.get('/:type', (req, res) => {
    const {type} = req.params;
    const service_ip = req.connection.remoteAddress;
    const service_port = req.header('x-port');
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
        servicesStorage.push(new serviceClass(service_ip, service_port));
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

