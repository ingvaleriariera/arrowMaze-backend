import { LevelProgressDTO } from './level-progress.dto';

export class SyncProgressInput {
  userId: string;
  levels: LevelProgressDTO[];
}
