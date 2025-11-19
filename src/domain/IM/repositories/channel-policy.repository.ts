export interface ChannelPolicyRepository {
  getDefault(): Promise<{ id: number; name: string; config: any; enabled: boolean } | null>;
}
