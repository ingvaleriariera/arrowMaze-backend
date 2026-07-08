export class Coins {
  private constructor(readonly value: number) {}

  static create(amount: number): Coins {
    if (!Number.isInteger(amount)) {
      throw new Error(`Coins must be an integer, got: ${amount}`);
    }

    if (amount < 0) {
      throw new Error(`Coins must be non-negative, got: ${amount}`);
    }

    return new Coins(amount);
  }

  static zero(): Coins {
    return new Coins(0);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Coins): boolean {
    return this.value === other.value;
  }
}
