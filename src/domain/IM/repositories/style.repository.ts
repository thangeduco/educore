export interface StyleRepository {
  resolve(type: string, ref: string, version: number): Promise<{ id?: number; type: string; name: string; version: number; enabled: boolean; styleConfig: any } | null>;
}
