import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private constructor(readonly value: string) {}

  static generate(): UserId {
    return new UserId(uuidv4());
  }

  static create(value: string): UserId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }

    return new UserId(value.toLowerCase());
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
