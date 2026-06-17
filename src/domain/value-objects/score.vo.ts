export class Score {
  private constructor(readonly value: number) {}

  static create(points: number): Score {
    if (!Number.isInteger(points)) {
      throw new Error(`Score must be an integer, got: ${points}`);
    }

    if (points < 0) {
      throw new Error(`Score must be non-negative, got: ${points}`);
    }

    return new Score(points);
  }

  isGreaterThan(other: Score): boolean {
    return this.value > other.value;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Score): boolean {
    return this.value === other.value;
  }
}
