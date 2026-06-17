export class LevelId {
  private constructor(readonly value: string) {}

  static create(value: string): LevelId {
    const id = value.trim();

    if (id.length === 0) {
      throw new Error('LevelId cannot be empty');
    }

    if (id.length > 50) {
      throw new Error(
        `LevelId exceeds maximum length of 50 characters, got: ${id.length}`,
      );
    }

    return new LevelId(id);
  }

  equals(other: LevelId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
