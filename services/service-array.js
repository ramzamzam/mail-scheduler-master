"use strict";
const EventEmitter = require('events').EventEmitter;

/**
 * Class for managing services
 * Provides Iterator-like interface for distributing load
 * on the services
 */
class ServiceArray {
    constructor() {
        this.array = [];
        this.current = 0;
        this.notifications = new EventEmitter();
    }

    /**
     * Adds service to list
     * Notifies subscribers on first added service
     *
     * @param service {SenderService | TokenizerService} service instance
     */
    push(service) {
        if(!this.array.find(s => s.ip === service.ip && s.port === service.port)) {
            this.array.push(service);
            // if we got our first service we notify subscribers
            if(this.array.length === 1) {
                this.notifications.emit('new_service');
            }
        }
    }

    /**
     * Removes giver service from services list
     * @param service {SenderService | TokenizerService} service instance
     */
    remove(service) {
        const serviceIndex = this.array.findIndex(s => s === service);
        this.array.splice(serviceIndex, 1);
    }

    /**
     * Iterates over services
     * @returns {SenderService | TokenizerService}
     */
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