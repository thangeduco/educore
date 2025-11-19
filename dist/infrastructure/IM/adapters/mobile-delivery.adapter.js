"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileDeliveryAdapter = void 0;
class MobileDeliveryAdapter {
    async send(_payload) {
        // TODO: push FCM/APNs
        return { ok: true };
    }
}
exports.MobileDeliveryAdapter = MobileDeliveryAdapter;
