import { InteractionTrigger } from '../models/interaction-trigger.model';
export interface EventRepository {
  create(e: InteractionTrigger): Promise<number>;
  findById(id: number): Promise<InteractionTrigger | null>;
}
