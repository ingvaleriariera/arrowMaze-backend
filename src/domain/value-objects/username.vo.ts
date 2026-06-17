export class Username {
  private constructor(readonly value: string) {}

  static create(raw: string): Username {
    const username = raw.trim();

    if (username.length < 3 || username.length > 30) {
      throw new Error(
        `Username must be between 3 and 30 characters, got: ${username.length}`,
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      throw new Error(
        `Username can only contain letters, numbers and underscores: ${username}`,
      );
    }

    return new Username(username);
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
