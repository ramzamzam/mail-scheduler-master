"use strict";

const pg = require('pg-promise')();
const db_config = require('../config.json').db;
let connection = pg(db_config);

module.exports = connection;

