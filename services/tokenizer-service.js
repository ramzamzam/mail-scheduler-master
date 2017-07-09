"use strict";

const request = require('./../lib/request');

/**
 * Provides easy access to tokenizer API
 */
class TokenizerService {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        console.log(`new tokenizer service on ${ip} - ${port}`);
    }

    updateTokens(text) {
        const options = {
            method: 'POST',
            ip  : this.ip,
            port : this.port,
            path : '/tokens',
            headers : {
                "Content-Type" : "application/json"
            },
            data: {
                text
            }
        };
        return request(options);
    }
}

module.exports = TokenizerService;