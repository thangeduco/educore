export class MobileDeliveryAdapter {
  async send(_payload: any): Promise<{ ok: boolean; error?: string }> {
    // TODO: push FCM/APNs
    return { ok: true };
  }
}
