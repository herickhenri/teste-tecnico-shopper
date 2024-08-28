import { MeasuresRepository } from '../../repositories/measures-repository.js'
import { MeasuresNotFoundError } from '../errors/measures-not-found-error.js'

interface GetMeasuresRequest {
  type?: 'WATER' | 'GAS'
  customer_code: string
}

export class GetMeasuresUseCases {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({ type, customer_code }: GetMeasuresRequest) {
    const measures =
      await this.measuresRepository.findByCustomerCode(customer_code)

    if (!measures || measures.length === 0) {
      throw new MeasuresNotFoundError()
    }

    const measuresFiltered =
      type && measures.filter((measure) => measure.type === type)

    return { measures: measuresFiltered ?? measures }
  }
}
