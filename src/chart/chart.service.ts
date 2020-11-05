import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartEntity } from './chart.entity';
import { CreateChartDto, QueryChartDto } from './dto';

@Injectable()
export class ChartService {
  constructor(@InjectRepository(ChartEntity) private readonly repository: Repository<ChartEntity>) {}

  async findAll(query: QueryChartDto): Promise<any> {
    let limit = query.limit || 10
    let page = query.page ? query.page - 1 : 0
    return await this.repository
    .createQueryBuilder("chart")
    .skip(limit * page)
    .take(limit)
    .getManyAndCount();
  }

  async clear() {
    return await this.repository.clear()
  }

  async findOne(query: QueryChartDto): Promise<ChartEntity> {
    return await this.repository.findOne({name: query.name})
  }

  async save(data: any): Promise<ChartEntity> {
    let fineone = await this.repository.findOne({name: data.name})
    if (fineone) {
      if(fineone.dates.includes(data.dates)) {
        
      } else {
        fineone.name = data.name;
        fineone.datas = [...fineone.datas, data.datas];
        fineone.dates = [...fineone.dates, data.dates];
        return await this.repository.save(fineone);
      }
    } else {
      let fund = new ChartEntity();
      fund.name = data.name;
      fund.datas = [data.datas];
      fund.dates = [data.dates];
      return await this.repository.save(fund);
    }
  }
}
