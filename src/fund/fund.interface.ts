import { FundEntity } from './fund.entity'

export interface FundRO {
  data: FundEntity[],
  total: number,
  message: string
}
