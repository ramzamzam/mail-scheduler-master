"use strict";

const connection = require('./db');

function getTokens(limit) {
    limit = limit || 10;
    const query = 'select * from tokens order by count desc limit $(limit)';
    return connection.manyOrNone(query, {limit});
}

module.exports = getTokens;