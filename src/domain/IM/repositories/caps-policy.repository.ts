export interface CapsPolicyRepository {
  getDefault(): Promise<{ id: number; name: string; policy: any; enabled: boolean } | null>;
  getById(id: number): Promise<{ id: number; name: string; policy: any; enabled: boolean } | null>;
}
