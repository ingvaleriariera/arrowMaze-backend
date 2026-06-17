export class PasswordHash {
  private constructor(readonly value: string) {}

  static create(hashed: string): PasswordHash {
    if (!hashed || hashed.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }

    return new PasswordHash(hashed);
  }

  toString(): string {
    return this.value;
  }
}
