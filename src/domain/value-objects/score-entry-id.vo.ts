import { v4 as uuidv4 } from 'uuid';

export class ScoreEntryId {
  private constructor(readonly value: string) {}

  static generate(): ScoreEntryId {
    return new ScoreEntryId(uuidv4());
  }

  static create(value: string): ScoreEntryId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }

    return new ScoreEntryId(value.toLowerCase());
  }

  equals(other: ScoreEntryId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
