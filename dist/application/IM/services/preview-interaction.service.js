"use strict";
// import { PreviewEventDTO, PreviewResultDTO } from '../dtos/preview-event.dto';
// import { RuleRepository } from '../../domain/IM/repositories/rule.repository';
// import { InteractionTypeRepository } from '../../domain/IM/repositories/interaction-type.repository';
// import { StyleRepository } from '../../domain/IM/repositories/style.repository';
// export class PreviewInteractionService {
//   constructor(
//     private readonly ruleRepo: RuleRepository,
//     private readonly typeRepo: InteractionTypeRepository,
//     private readonly styleRepo: StyleRepository
//   ) {}
//   async execute(dto: PreviewEventDTO): Promise<PreviewResultDTO> {
//     const rules = await this.ruleRepo.listActiveByEventType(dto.eventType, dto.occurredAt ? new Date(dto.occurredAt) : new Date());
//     const candidates = rules.flatMap(r => (r.actions as any[] ?? []).map(a => ({
//       type: String(a.interaction_type ?? 'popup_message'),
//       channel: String(a.channel ?? 'web'),
//       priority: Number(a.priority_boost ?? r.priority ?? 50),
//       reasons: ['rule:'+r.name]
//     })));
//     const payloads = [];
//     for (const c of candidates) {
//       const it = await this.typeRepo.getByType(c.type);
//       if (!it) continue;
//       const style = await this.styleRepo.resolve(c.type, 'quiz_plain', 1).catch(()=>null);
//       payloads.push({ type: c.type, channel: c.channel, example: { style } });
//     }
//     return { candidates, payloads };
//   }
// }
