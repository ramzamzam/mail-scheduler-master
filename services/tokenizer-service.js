"use strict";

const request = require('request-promise');

class TokenizerService {
    constructor(uri) {
        this.uri = uri;
    }

    getTokens(text) {
        const options = {
            method: 'POST',
            uri: `${this.uri}/tokens`,
            body: {
                text
            },
            json: true
        };
        return request(options);
    }
}

module.exports = TokenizerService;