import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AuthModule } from './infrastructure/modules/auth.module';
import { LevelModule } from './infrastructure/modules/level.module';
import { ProgressModule } from './infrastructure/modules/progress.module';
import { ScoreModule } from './infrastructure/modules/score.module';
import { LeaderboardModule } from './infrastructure/modules/leaderboard.module';
import { DatabaseSeeder } from './infrastructure/seeders/database.seeder';
import { LoggingInterceptor } from './infrastructure/aop/logging.interceptor';
import { HttpExceptionFilter } from './infrastructure/aop/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
    AuthModule,
    LevelModule,
    ProgressModule,
    ScoreModule,
    LeaderboardModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseSeeder: DatabaseSeeder) {}

  async onModuleInit(): Promise<void> {
    await this.databaseSeeder.seed();
  }
}
