/**
 * Created by ram on 09.07.17.
 */


const tokenizers = require('./../services/service-discovery').tokenizers;
const db = require('./db');

/**
 * Makes a request to tokenizer service
 *
 * @param text {string} message body
 */
function updateTokens(text) {
    const tokenizer = tokenizers.next();
    if (tokenizer) {
        tokenizer.updateTokens(text)
            .catch(err => {
                console.log(err);
                if (err === 'NO_CONNECTION') {
                    // if service is not reachable anymore, we remove it from list
                    tokenizers.remove(tokenizer);
                    updateTokens(text);
                }
            })
    } else {
        // in case when no tokenizer registered, we need to wait till we get one
        tokenizers.notifications.once('new_service', () => {
            updateTokens(text);
        });
    }
}

/**
 * Obtains most used tokens from database
 *
 * @param [limit] {number} number of needed tokens
 * @returns {*}
 */
function getTokens(limit) {
    limit = limit || 10;
    const query = 'select * from tokens order by count desc limit $(limit)';
    return db.manyOrNone(query, {limit});
}

module.exports = {
    getTokens,
    updateTokens
};