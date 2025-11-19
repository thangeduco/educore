export interface Rule {
  id?: number;
  name: string;
  version: number;
  enabled: boolean;
  triggerEventTypes: string[];
  priority: number;
  conditions: Record<string, unknown>;
  actions: Array<Record<string, unknown>>;
  channels: string[];
  capsPolicyId?: number | null;
  validFrom?: Date | null;
  validTo?: Date | null;
}
