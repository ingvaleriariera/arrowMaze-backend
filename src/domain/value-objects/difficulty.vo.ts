export class Difficulty {
  private constructor(readonly value: string) {}

  static easy(): Difficulty {
    return new Difficulty('easy');
  }

  static medium(): Difficulty {
    return new Difficulty('medium');
  }

  static hard(): Difficulty {
    return new Difficulty('hard');
  }

  static create(raw: string): Difficulty {
    const difficulty = raw.toLowerCase().trim();

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Error(
        `Invalid difficulty: ${raw}. Must be 'easy', 'medium' or 'hard'`,
      );
    }

    return new Difficulty(difficulty);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Difficulty): boolean {
    return this.value === other.value;
  }
}
