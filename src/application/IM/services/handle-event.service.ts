// import { IngestEventDTO, HandleEventResultDTO } from '../dtos/ingest-event.dto';
// import { EventRepository } from '../../domain/IM/repositories/event.repository';
// import { InteractionPlanRepository } from '../../domain/IM/repositories/interaction-plan.repository';
// import { RuleRepository } from '../../domain/IM/repositories/rule.repository';
// import { CapsPolicyRepository } from '../../domain/IM/repositories/caps-policy.repository';
// import { ChannelPolicyRepository } from '../../domain/IM/repositories/channel-policy.repository';
// import { InteractionTypeRepository } from '../../domain/IM/repositories/interaction-type.repository';
// import { StyleRepository } from '../../domain/IM/repositories/style.repository';
// import { DeliveryLogRepository } from '../../domain/IM/repositories/delivery-log.repository';

// export class HandleEventService {
//   constructor(
//     private readonly idempotency: { accept(key: string, ttlSec?: number): Promise<boolean> },
//     private readonly eventRepo: EventRepository,
//     private readonly planRepo: InteractionPlanRepository,
//     private readonly ruleRepo: RuleRepository,
//     private readonly capsRepo: CapsPolicyRepository,
//     private readonly channelRepo: ChannelPolicyRepository,
//     private readonly typeRepo: InteractionTypeRepository,
//     private readonly styleRepo: StyleRepository,
//     private readonly deliveryRepo: DeliveryLogRepository,
//     private readonly adapters: {
//       web: { send(p: any): Promise<{ ok: boolean; error?: string }> };
//       mobile: { send(p: any): Promise<{ ok: boolean; error?: string }> };
//     }
//   ) {}

//   // Phase 1: skeleton — chọn tất cả action hợp lệ, render đơn giản, gửi ngay
//   async execute(dto: IngestEventDTO): Promise<HandleEventResultDTO> {
//     if (!(await this.idempotency.accept(dto.idempotencyKey, 86400))) {
//       return { eventId: -1, planId: null, decisionsCount: 0, deliveries: [] };
//     }

//     const eventId = await this.eventRepo.create({
//       eventId: null,
//       idempotencyKey: dto.idempotencyKey,
//       source: dto.source,
//       eventType: dto.eventType,
//       studentId: dto.studentId,
//       parentId: dto.parentId,
//       courseId: dto.courseId,
//       weekId: dto.weekId,
//       lessonId: dto.lessonId,
//       videoId: dto.videoId,
//       payload: dto.payload,
//       occurredAt: new Date(dto.occurredAt),
//       correlationId: dto.correlationId,
//       extraTags: dto.extraTags
//     });

//     // lấy rules theo eventType
//     const rules = await this.ruleRepo.listActiveByEventType(dto.eventType, new Date(dto.occurredAt));
//     // flatten actions -> candidates (rất đơn giản cho skeleton)
//     const candidates = rules.flatMap(r => (Array.isArray(r.actions) ? r.actions : []).map(a => ({
//       type: String((a as any).interaction_type ?? 'popup_message'),
//       channel: String((a as any).channel ?? 'web'),
//       audience: (a as any).audience ?? { role: 'student' },
//       style: (a as any).style,
//       bindings: (a as any).bindings ?? {},
//       priority: Number((a as any).priority_boost ?? r.priority ?? 50),
//       reasons: ['rule:'+r.name]
//     })));

//     const planId = await this.planRepo.createPlan(eventId, dto.studentId ?? null, { candidates }, 'decided');

//     // render rất nhẹ: kiểm tra type + style tồn tại, tạo payload
//     const payloads = [];
//     for (const c of candidates) {
//       const it = await this.typeRepo.getByType(c.type);
//       if (!it) continue;
//       const style = c.style ? await this.styleRepo.resolve(c.type, c.style.ref, c.style.version) : null;

//       const recipient = (c.audience?.role === 'parent' && dto.parentId)
//         ? { id: dto.parentId, role: 'parent' as const }
//         : { id: dto.studentId ?? 'unknown', role: 'student' as const };

//       payloads.push({
//         type: c.type,
//         channel: c.channel,
//         recipient,
//         content: { ...c.bindings, style },
//         meta: { priority: c.priority }
//       });
//     }

//     // delivery ngay
//     const deliveries = [];
//     for (const p of payloads) {
//       const res = p.channel === 'mobile' ? await this.adapters.mobile.send(p) : await this.adapters.web.send(p);
//       const did = await this.deliveryRepo.logDelivery(p, planId, res.ok ? 'sent' : 'failed', res.error, p.recipient);
//       deliveries.push({ deliveryId: did, type: p.type, channel: p.channel, recipientRole: p.recipient.role });
//     }

//     return { eventId, planId, decisionsCount: candidates.length, deliveries };
//   }
// }
