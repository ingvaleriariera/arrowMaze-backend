import { v4 as uuidv4 } from 'uuid';

export class ProgressId {
  private constructor(readonly value: string) {}

  static generate(): ProgressId {
    return new ProgressId(uuidv4());
  }

  static create(value: string): ProgressId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }

    return new ProgressId(value.toLowerCase());
  }

  equals(other: ProgressId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
