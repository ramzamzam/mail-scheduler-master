"use strict";

const request = require('./request');

class TokenizerService {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }

    getTokens(text) {
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
        return request(options).then(JSON.parse);
    }
}

module.exports = TokenizerService;