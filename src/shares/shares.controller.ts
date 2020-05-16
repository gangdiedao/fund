import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesEntity } from './shares.entity';
import { QuerySharesDto } from './dto';

@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Get()
  async findAll(@Query() query: QuerySharesDto): Promise<any> {
    let data = await this.sharesService.findAll(query);
    return {
      message: 'success',
      data: data[0],
      total: data[1]
    }
  }
}
