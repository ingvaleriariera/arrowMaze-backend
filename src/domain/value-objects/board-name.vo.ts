export class BoardName {
  private constructor(readonly value: string) {}

  static create(raw: string): BoardName {
    const name = raw.trim();

    if (name.length < 3 || name.length > 30) {
      throw new Error(
        `Board name must be between 3 and 30 characters, got: ${name.length}`,
      );
    }

    return new BoardName(name);
  }

  equals(other: BoardName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
