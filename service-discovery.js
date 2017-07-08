"use strict";
const router = require('express').Router();
const senders = [];
const tokenizers = [];

router.get('/sender', (req, res) => {
    const newSenderAddress = req.protocol + '://' +req.headers.host;;
    senders.push(newSenderAddress);
    
});

module.exports = {
    router
};

