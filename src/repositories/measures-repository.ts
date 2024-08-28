export type Measure = {
  id: string
  customer_code: string
  image_url: string
  value: number
  datetime: Date
  type: 'WATER' | 'GAS'
  has_confirmed: boolean
  confimed_value?: number
}

export type MeasureInput = {
  customer_code: string
  image_url: string
  value: number
  datetime: Date
  type: 'WATER' | 'GAS'
}

export type ConfirmMeasureInput = {
  id: string
  confirmed_value: number
}

export interface MeasuresRepository {
  create(measureInput: MeasureInput): Promise<Measure>
  findByCustomerCode(customerCode: string): Promise<Measure[] | null>
  findById(id: string): Promise<Measure | null>
  confirm(data: ConfirmMeasureInput): Promise<void>
}
