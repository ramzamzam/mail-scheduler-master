"use strict";

const request = require('./../lib/request');

/**
 * Provides easy access to sender agent API
 */
class SenderService {
    constructor(ip, port) {
        this.ip = ip;
        this.port  = port;
        console.log(`new sender service on ${ip} - ${port}`);
    }

    sendMessage(email, text) {
        const options = {
            method: 'POST',
            ip  : this.ip,
            port : this.port,
            path : '/send',
            headers : {
                "Content-Type" : "application/json"
            },
            data: {
                text,
                email
            }
        };
        return request(options);
    }
}

module.exports = SenderService;
