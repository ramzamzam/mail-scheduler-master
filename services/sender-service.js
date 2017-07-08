"use strict";

const request = require('./request');

class SenderService {
    constructor(ip, port) {
        this.ip = ip;
        this.port  = port;
        console.log(`new service on ${ip} - ${port}`);
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