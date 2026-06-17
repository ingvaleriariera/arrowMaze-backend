export class MoveLimit {
  private constructor(readonly value: number) {}

  static create(max: number): MoveLimit {
    if (!Number.isInteger(max)) {
      throw new Error(`MoveLimit must be an integer, got: ${max}`);
    }

    if (max <= 0) {
      throw new Error(`MoveLimit must be greater than 0, got: ${max}`);
    }

    return new MoveLimit(max);
  }

  getValue(): number {
    return this.value;
  }
}
