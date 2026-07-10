import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Reset testing coin balance to 0
 *
 * Updates player_progress records that have exactly 9999 coins (the testing default)
 * to 0 coins, as the frontend has now implemented the real coin economy where:
 * - New players start with 0 coins
 * - Coins are earned by completing levels (score = coins earned)
 *
 * Other coin balances are left untouched, as they may represent actual player progress.
 */
export class ResetTestingCoinsBalance1720594800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "player_progress" SET "coins" = 0 WHERE "coins" = 9999`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No rollback needed - this was a one-time data correction for testing data
    // If needed, restore from backup
  }
}
