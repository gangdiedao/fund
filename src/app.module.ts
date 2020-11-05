import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { FundModule } from './fund/fund.module';
import { FundEntity } from './fund/fund.entity'
import { SharesModule } from './shares/shares.module';
import { SharesEntity } from './shares/shares.entity';
import { ChartEntity } from './chart/chart.entity';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "postgres",
      "password": "123456",
      "database": "fund_db",
      "synchronize": true,
      "entities": [FundEntity, SharesEntity, ChartEntity]
    }),
    FundModule,
    SharesModule,
    ChartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
