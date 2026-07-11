import { v4 as uuidv4 } from 'uuid';

export class CustomBoardId {
  private constructor(readonly value: string) {}

  static generate(): CustomBoardId {
    return new CustomBoardId(uuidv4());
  }

  static create(value: string): CustomBoardId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }

    return new CustomBoardId(value.toLowerCase());
  }

  equals(other: CustomBoardId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
