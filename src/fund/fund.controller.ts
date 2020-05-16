import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { FundService } from './fund.service';
import { SharesService } from '../shares/shares.service'
import { FundEntity } from './fund.entity';
import { CreateFundDto, QueryFundDto } from './dto';
import { FundRO } from './fund.interface';
const request = require('request');

const fetchFund = (url: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'get',
      url: url,
    };
    request(options, (err, res, body) => {
      if (err || res.statusCode != 200) {
        reject(err || res.statusCode)
        return
      }
      let data = body.toString().replace(/(\s+|\r\n)/g, '').match(/(?<=\()\{.*\}(?=\))/g)
      if (data && data.length > 0) {
        const { Datas } = JSON.parse(data[0])
        resolve(Datas)
      } else {
        reject('数据解析失败')
      }
    });
  })
}

const sleep = (time = 200) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService, private readonly sharesService: SharesService) {}

  @Get()
  async findAll(@Query() query: QueryFundDto): Promise<FundRO> {
    let res = await this.fundService.findAll(query);
    return {
      data: res[0],
      total: res[1],
      message: 'success'
    }
  }

  @Post()
  async create(@Body() data: CreateFundDto): Promise<any> {
    return await this.fundService.save(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return await this.fundService.remove(id);
  }

  @Post('/add')
  async add(@Body() data: any): Promise<any> {
    let res = await this.entryData(data.code)
    return {
      message: 'success',
      data: res
    }
  }

  entryData(code: string) :Promise<any> {
    return new Promise(async (resolve, reject) => {
      let jjgmapi = `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx?callback=jQuery311005094808055790967_1589349056911&FCODE=${code}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=1589349056938`
      const jjgma: any = await fetchFund(jjgmapi)
      if (!jjgma) {
        reject('无法查询到数据')
        return
      }
      await sleep(1024)
      let fundmapi = `https://fundmobapi.eastmoney.com/FundMApi/FundInverstPositionDetail.ashx?callback=jQuery311036786125210873766_1589337965131&FCODE=${code}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&DATE=2020-03-31&_=1589337965152`
      const gp: any = await fetchFund(fundmapi)
      let result
      if(gp.fundStocks.length) {
        for(let j = 0; j < gp.fundStocks.length; j++) {
          let gpdata = {
            code: gp.fundStocks[j]['GPDM'],
            name: gp.fundStocks[j]['GPJC'],
            lists: {
              name: jjgma['SHORTNAME'],
              code: jjgma['FCODE'],
              markval: (jjgma['ENDNAV'] * (gp.fundStocks[j]['JZBL']/100)).toFixed(2)
            },
          }
          await this.sharesService.save(gpdata)
        }
        let data = {
          name: jjgma['SHORTNAME'],
          code: jjgma['FCODE'],
          lists: gp.fundStocks.map(item => {
            return {
              code: item['GPDM'],
              name: item['GPJC'],
              zxj: item['ZXJ'],
              jzbl: item['JZBL'] || 0,
              markval: (jjgma['ENDNAV'] * (item['JZBL']/100)).toFixed(2)
            }
          }),
          scale: jjgma['ENDNAV'],
        }
        result = await this.fundService.save(data);
      }
      resolve(result)
    })
  }

  @Get('queryfund')
  async queryFund(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.sharesService.clear()
        this.fundService.clear()
        let size = 30
        let res = []
        for(let p = 1; p < 6; p++) {
          let url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNRankNewList?callback=jQuery31107742468908593421_1589627389972&fundtype=0&SortColumn=SYL_1N&Sort=desc&pageIndex=${p}&pagesize=${size}&companyid=&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=1589627389978`
          let fundList: any = await fetchFund(url)
          fundList = fundList.filter(item => item['FUNDTYPE'] == '001' || item['FUNDTYPE'] == '002')
          res = [...res, ...fundList]
          await sleep(500)
        }
        let len = res.length
        res = res.map(item => item['FCODE'])
        for(let i = 0; i < len; i++) {
          await this.entryData(res[i])
        }
      } catch (error) {
        console.log(error)
      }
      resolve('ok')
    })
    // return 'ok'
  }
}
