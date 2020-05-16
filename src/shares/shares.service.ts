import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharesEntity } from './shares.entity';
import { CreateSharesDto, QuerySharesDto } from './dto';

@Injectable()
export class SharesService {
  constructor(@InjectRepository(SharesEntity) private readonly repository: Repository<SharesEntity>) {}

  async findAll(query: QuerySharesDto): Promise<any> {
    let where
    if (/\d+/.test(query.keyword)) {
      where = { name: "", code: query.keyword }
    } else {
      where = { name: `%${query.keyword}%`, code: "" }
    }
    let limit = query.limit || 10
    let page = query.page ? query.page - 1 : 0
    return await this.repository
    .createQueryBuilder("shares")
    .where("shares.name LIKE :name OR shares.code = :code", where)
    .orderBy("shares.count", "DESC")
    .skip(limit * page)
    .take(limit)
    .getManyAndCount();
  }

  async clear() {
    return await this.repository.clear()
  }

  async save(data: CreateSharesDto): Promise<SharesEntity> {
    let fineone = await this.repository.findOne({code: data.code})
    if (fineone) {
      fineone.name = data.name;
      if (!fineone.lists.some(item => item.code == data.lists.code)) {
        fineone.lists = [...fineone.lists, data.lists];
      }
      fineone.count = fineone.lists.length
      return await this.repository.save(fineone);
    } else {
      let item = new SharesEntity();
      item.name = data.name;
      item.code = data.code;
      item.lists = [data.lists];
      item.count = 1;
      return await this.repository.save(item);
    }
  }
}
