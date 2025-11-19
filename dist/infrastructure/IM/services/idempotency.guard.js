"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryIdempotencyGuard = void 0;
class InMemoryIdempotencyGuard {
    constructor() {
        this.cache = new Set();
    }
    async accept(key, _ttlSec = 86400) {
        if (this.cache.has(key))
            return false;
        this.cache.add(key);
        return true;
    }
}
exports.InMemoryIdempotencyGuard = InMemoryIdempotencyGuard;
