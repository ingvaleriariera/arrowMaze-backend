import { LevelProgressDTO } from './level-progress.dto';

export class SyncProgressInput {
  userId: string;
  levels: LevelProgressDTO[];
  // Undefined means the client didn't send a balance (e.g. an older
  // client) — must NOT be treated as "reset to 0", or every sync from
  // such a client would wipe out whatever coins the server already has.
  coins?: number;
}
