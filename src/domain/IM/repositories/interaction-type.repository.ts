export interface InteractionTypeRepository {
  getByType(type: string): Promise<{ type: string; schema: any; renderAdapter: string; enabled: boolean } | null>;
}
