"use strict";
const http = require('http');

function request(options) {
    return new Promise((resolve, reject) => {
        const request = http.request({
            host: options.ip,
            port: options.port,
            path: options.path,
            headers: options.headers,
            method: options.method,
        }, function (res) {
            const {statusCode} = res;
            let incoming = '';
            res.on('data', d => incoming += d);

            res.on('end', function () {
                if (statusCode === 200) {
                    resolve(incoming.toString());
                } else {
                    reject({statusCode, data: incoming.toString()});
                }
            })

        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

        if (options.data) {
            request.write(JSON.stringify(options.data));
        }

        request.end();

    })
}

module.exports = request;