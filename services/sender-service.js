"use strict";

const request = require('request-promise');

class SenderService {
    constructor(uri) {
        this.uri = uri;
    }

    sendMessage(email, text) {
        const options = {
            method: 'POST',
            uri: `${this.uri}/send`,
            body: {
                email,
                text
            },
            json: true
        };
        return request(options);
    }
}

module.exports = SenderService;