import { ChartEntity } from './chart.entity'

export interface ChartRO {
  data: ChartEntity[],
  total: number,
  message: string
}
