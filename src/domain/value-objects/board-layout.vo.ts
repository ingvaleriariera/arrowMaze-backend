export class BoardLayout {
  private constructor(readonly data: string) {}

  static create(json: string): BoardLayout {
    const trimmed = json.trim();

    if (!trimmed) {
      throw new Error('BoardLayout JSON cannot be empty');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed = JSON.parse(trimmed);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (Object.keys(parsed).length === 0) {
        throw new Error('BoardLayout JSON must not be empty');
      }
    } catch (error) {
      throw new Error(
        `BoardLayout must be valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return new BoardLayout(trimmed);
  }

  toJson(): string {
    return this.data;
  }
}
