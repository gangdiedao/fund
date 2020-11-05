import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartEntity } from './chart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChartEntity])],
  controllers: [ChartController],
  providers: [ChartService]
})
export class ChartModule {}
