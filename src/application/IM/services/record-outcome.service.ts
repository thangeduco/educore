// import { RecordOutcomeDTO } from '../dtos/record-outcome.dto';
// import { OutcomeRepository } from '../../domain/IM/repositories/outcome.repository';

// export class RecordOutcomeService {
//   constructor(private readonly repo: OutcomeRepository) {}
//   async execute(dto: RecordOutcomeDTO): Promise<void> {
//     await this.repo.createOutcome(
//       dto.deliveryId, dto.status, dto.metrics ?? {},
//       dto.occurredAt ? new Date(dto.occurredAt) : new Date()
//     );
//   }
// }
