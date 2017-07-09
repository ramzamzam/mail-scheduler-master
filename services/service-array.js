"use strict";
const EventEmitter = require('events').EventEmitter;

class ServiceArray {
    constructor() {
        this.array = [];
        this.current = 0;
        this.notifications = new EventEmitter();
    }

    push(service) {
        if(!this.array.find(s => s.ip === service.ip && s.port === service.port)) {
            this.array.push(service);
            // if we got our first service we notify subscribers
            if(this.array.length === 1) {
                this.notifications.emit('new_service');
            }
        }
    }

    remove(service) {
        // const serviceIndex = this.array.findIndex(s => s.ip === service.ip && s.port === service.port);
        const serviceIndex = this.array.findIndex(s => s === service);
        this.array.splice(serviceIndex, 1);
    }

    next() {
        if(this.array.length === 0) return null;
        if(this.current < this.array.length) {
            return this.array[this.current++];
        } else {
            this.current = 0;
            return this.next();
        }
    }
}

module.exports = ServiceArray;