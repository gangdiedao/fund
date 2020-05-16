import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundEntity } from './fund.entity';
import { CreateFundDto, QueryFundDto } from './dto';

@Injectable()
export class FundService {
  constructor(@InjectRepository(FundEntity) private readonly repository: Repository<FundEntity>) {}

  async findAll(query: QueryFundDto): Promise<any> {
    let where
    if (/\d+/.test(query.keyword)) {
      where = { name: "", code: query.keyword }
    } else {
      where = { name: `%${query.keyword || ''}%`, code: "" }
    }
    let limit = query.limit || 10
    let page = query.page ? query.page - 1 : 0
    return await this.repository
    .createQueryBuilder("fund")
    .where("fund.name LIKE :name OR fund.code = :code", where)
    // .orderBy("fund.scale", "DESC")
    .skip(limit * page)
    .take(limit)
    .getManyAndCount();
  }

  async clear() {
    return await this.repository.clear()
  }

  async findOne(query: QueryFundDto): Promise<FundEntity> {
    return await this.repository.findOne({code: query.keyword})
  }

  async save(data: CreateFundDto): Promise<FundEntity> {
    let fineone = await this.repository.findOne({code: data.code})
    if (fineone) {
      fineone.name = data.name;
      fineone.scale = data.scale;
      fineone.lists = data.lists;
      return await this.repository.save(fineone);
    } else {
      let fund = new FundEntity();
      fund.name = data.name;
      fund.code = data.code;
      fund.scale = data.scale;
      fund.lists = data.lists;
      return await this.repository.save(fund);
    }
  }

  async remove(id: number): Promise<any> {
    const res = await this.repository.findOne(id);
    return await this.repository.remove(res);
  }
}
