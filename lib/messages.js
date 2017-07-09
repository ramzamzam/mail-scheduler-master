"use strict";

const db = require('./db');
const senders = require('./../services/service-discovery').senders;

function updateMessageStatus(id, status) {
    return new Promise((resolve) => {
        const update_status_query = 'update messages set is_sent = $(status) where id = $(id)';
        resolve(db.none(update_status_query, {id, status}));
    })
}
function getMessage(id) {
    return new Promise((resolve, reject) => {
        const getMessageQuery = 'select email, text, is_sent from messages where id = $(id)';
        db.one(getMessageQuery, {id})
            .then(resolve)
            .catch(reject);
    })
}

function saveMessage(email, text, datetime) {
    return new Promise((resolve, reject) => {
        const save_message_query = 'insert into messages (text, email, send_date)' +
            'values ($(text), $(email), $(datetime)) returning id::text';
        db.one(save_message_query, {
            email,
            datetime,
            text
        })
            .then(resolve)
            .catch(reject);
    })
}

function sendMessage(email, text, id) {
    return new Promise((resolve, reject) => {
        const sender = senders.next();
        if (sender) {
            sender.sendMessage(email, text)
                .then(() => {
                    if (!id) return Promise.resolve();
                    return updateMessageStatus(id, true);
                })
                .then(resolve)
                .catch(reject);
        } else {
            console.log('subscribe senders');
            // if there is no senders yet we need to wait till we get one
            senders.notifications.once('new_service', () => {
                sendMessage(email, text, id)
                    .then(resolve)
                    .catch(reject);
            });
        }
    })
}

function scheduleUnsentMessages() {
    return new Promise((resolve, reject) => {
        const get_messages_query = 'select id, to_json(send_date)::text as send_date ' +
            'from messages where is_sent = false';
        db.manyOrNone(get_messages_query)
            .then(messages => {
                messages.forEach(m => scheduleMessage(m.id, new Date(m.send_Date)));
                return resolve();
            })
            .catch(reject)
    })
}

function scheduleMessage(id, date) {
    getMessage(id)
        .then(message => {

            if (message.is_sent) return Promise.reject(new Error(`Message ${id} is sent already!`));

            if (date.getTime() > new Date().getTime()) {
                schedule.scheduleJob(date, function () {
                    sendMessage(message.email, message.text, id)
                        .catch(console.error)
                })
            } else {
                sendMessage(message.email, message.text, id)
                    .catch(console.error)
            }
        })
        .catch(err => {
            console.error(err);
        })
}


module.exports = {
    scheduleUnsentMessages,
    scheduleMessage,
    saveMessage
};
