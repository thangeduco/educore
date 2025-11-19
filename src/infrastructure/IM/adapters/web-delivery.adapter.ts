export class WebDeliveryAdapter {
  async send(_payload: any): Promise<{ ok: boolean; error?: string }> {
    // TODO: gọi sang BF/WS thật
    return { ok: true };
  }
}
