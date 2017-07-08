"use strict";

class ServiceArray {
    constructor() {
        this.array = [];
        this.current = 0;
    }

    push(service) {
        if(!this.array.find(s => s.ip === service.ip && s.port === service.port)) {
            this.array.push(service);
        }
    }

    remove(service) {
        const serviceIndex = this.array.findIndex(s => s.uri === service.uri);
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