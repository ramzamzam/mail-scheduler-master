/**
 * Created by ram on 09.07.17.
 */


const tokenizers = require('./../services/service-discovery').tokenizers;
const db = require('./db');


function updateTokens(text) {
    const tokenizer = tokenizers.next();
    if (tokenizer) {
        tokenizer.updateTokens(text)
            .catch(err => {
                console.log(err);
                if (err === 'NO_CONNECTION') {
                    tokenizers.remove(tokenizer);
                    updateTokens(text);
                }
            })
    } else {
        tokenizers.notifications.once('new_service', () => {
            updateTokens(text);
        });
    }
}


function getTokens(limit) {
    limit = limit || 10;
    const query = 'select * from lib order by count desc limit $(limit)';
    return db.manyOrNone(query, {limit});
}

module.exports = {
    getTokens,
    updateTokens
};