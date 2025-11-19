// import { HandleEventService } from '../../../application/IM/services/handle-event.service';
// import { IngestEventDTO } from '../../../application/IM/dtos/ingest-event.dto';

// export class ImEventController {
//   constructor(private readonly handleEvent: HandleEventService) {}

//   postEvent = async (req: any, res: any) => {
//     const dto: IngestEventDTO = {
//       idempotencyKey: req.headers['idempotency-key'] ?? ('cm-'+Date.now()),
//       ...req.body
//     };
//     const result = await this.handleEvent.execute(dto);
//     res.status(202).json(result);
//   }
// }
