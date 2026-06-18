import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../../domain/aggregates/user.aggregate';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Username } from '../../../../domain/value-objects/username.vo';
import { PasswordHash } from '../../../../domain/value-objects/password-hash.vo';
import { UserRole } from '../../../../domain/value-objects/user-role.vo';
import { UserId } from '../../../../domain/value-objects/user-id.vo';
import { LevelDefinition } from '../../../../domain/aggregates/level-definition.aggregate';
import { LevelId } from '../../../../domain/value-objects/level-id.vo';
import { Difficulty } from '../../../../domain/value-objects/difficulty.vo';
import { MoveLimit } from '../../../../domain/value-objects/move-limit.vo';
import { BoardLayout } from '../../../../domain/value-objects/board-layout.vo';
import { PlayerProgress } from '../../../../domain/aggregates/player-progress.aggregate';
import { ScoreEntry } from '../../../../domain/aggregates/score-entry.aggregate';
import { Score } from '../../../../domain/value-objects/score.vo';
import { ProgressId } from '../../../../domain/value-objects/progress-id.vo';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const generateValidUUID = (): string => {
  return '550e8400-e29b-41d4-a716-446655440000';
};

const generateValidLevelId = (index: number): string => {
  const ids = [
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440006',
  ];
  return ids[index % ids.length];
};

export const makeUser = (
  email = 'test@example.com',
  username = 'testuser',
  role: 'player' | 'admin' = 'player',
): User => {
  const user = User.register(
    Email.create(email),
    Username.create(username),
    PasswordHash.create('hashed_password_123'),
  );

  if (role === 'admin') {
    user.promoteToAdmin();
  }

  return user;
};

export const makeLevelDefinition = (index = 0): LevelDefinition => {
  return LevelDefinition.create(
    LevelId.create(generateValidLevelId(index)),
    Difficulty.easy(),
    MoveLimit.create(10),
    BoardLayout.create(
      JSON.stringify({
        grid: [[0, 1], [1, 0]],
        rows: 2,
        cols: 2,
      }),
    ),
  );
};

export const makePlayerProgress = (
  userId = generateValidUUID(),
): PlayerProgress => {
  return PlayerProgress.create(UserId.create(userId));
};

export const makeScoreEntry = (
  userId = generateValidUUID(),
  levelIndex = 0,
  score = 100,
): ScoreEntry => {
  return ScoreEntry.create(
    UserId.create(userId),
    LevelId.create(generateValidLevelId(levelIndex)),
    Score.create(score),
  );
};
