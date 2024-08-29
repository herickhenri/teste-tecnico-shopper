import {
  Measure,
  MeasuresRepository,
} from '../../repositories/measures-repository.js'
import { MeasuresNotFoundError } from '../errors/measures-not-found-error.js'

interface GetMeasuresRequest {
  type?: 'WATER' | 'GAS'
  customer_code: string
}

export class GetMeasuresUseCases {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({ type, customer_code }: GetMeasuresRequest) {
    let measures: Measure[] | null =
      await this.measuresRepository.findByCustomerCode(customer_code)

    if (type) {
      const measuresFiltered =
        type && measures?.filter((measure) => measure.type === type)

      measures = measuresFiltered || null
    }

    if (!measures || measures.length === 0) {
      throw new MeasuresNotFoundError()
    }

    return { measures }
  }
}
