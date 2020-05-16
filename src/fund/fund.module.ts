import { Module } from '@nestjs/common';
import { FundController } from './fund.controller';
import { FundService } from './fund.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundEntity } from './fund.entity';
import { SharesModule } from '../shares/shares.module'

@Module({
  imports: [SharesModule, TypeOrmModule.forFeature([FundEntity])],
  controllers: [FundController],
  providers: [FundService]
})
export class FundModule {}
