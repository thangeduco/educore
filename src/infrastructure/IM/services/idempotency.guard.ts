export class InMemoryIdempotencyGuard {
  private cache = new Set<string>();
  async accept(key: string, _ttlSec = 86400): Promise<boolean> {
    if (this.cache.has(key)) return false;
    this.cache.add(key);
    return true;
  }
}
