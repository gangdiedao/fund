import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ChartService } from './chart.service'
import { CreateChartDto, QueryChartDto } from './dto';
import { ChartRO } from './chart.interface';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get()
  async getList(@Query() query: QueryChartDto): Promise<ChartRO> {
    let res = await this.chartService.findAll(query);
    return {
      data: res[0],
      total: res[1],
      message: 'success'
    }
  }

  @Get('/clear')
  async clear() {
    return await this.chartService.clear()
  }

  @Post()
  async create(@Body() data: CreateChartDto): Promise<any> {
    if(Array.isArray(data.name)) {
      for(let i = 0; i < data.name.length; i++) {
        await this.chartService.save({
          name: data.name[i],
          datas: data.datas[i],
          dates: data.dates,
        });
      }
    }
    return ''
  }
}
