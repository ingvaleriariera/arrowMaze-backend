export class UserRole {
  private constructor(readonly value: string) {}

  static player(): UserRole {
    return new UserRole('player');
  }

  static admin(): UserRole {
    return new UserRole('admin');
  }

  static create(value: string): UserRole {
    const role = value.toLowerCase().trim();

    if (role !== 'player' && role !== 'admin') {
      throw new Error(`Invalid role: ${value}. Must be 'player' or 'admin'`);
    }

    return new UserRole(role);
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }
}
