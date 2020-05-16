import { Module } from '@nestjs/common';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharesEntity } from './shares.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SharesEntity])],
  controllers: [SharesController],
  providers: [SharesService],
  exports: [SharesService]
})
export class SharesModule {}
