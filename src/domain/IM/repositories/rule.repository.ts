import { Rule } from '../models/rule.model';
export interface RuleRepository {
  listActiveByEventType(eventType: string, at: Date): Promise<Rule[]>;
}
