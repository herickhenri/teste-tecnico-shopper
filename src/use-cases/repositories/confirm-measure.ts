import { MeasuresRepository } from '../../repositories/measures-repository.js'
import { ConfirmationDuplicateError } from '../errors/confirmation-duplicate-error.js'
import { MeasureNotFoundError } from '../errors/measure-not-found-error.js'

interface ConfirmMeasureRequest {
  id: string
  confirmed_value: number
}

export class ConfirmMeasureUseCases {
  constructor(private measuresRepository: MeasuresRepository) {}

  async execute({ id, confirmed_value }: ConfirmMeasureRequest) {
    const measureFind = await this.measuresRepository.findById(id)

    if (!measureFind) {
      throw new MeasureNotFoundError()
    }

    if (measureFind.has_confirmed) {
      throw new ConfirmationDuplicateError()
    }

    await this.measuresRepository.confirm({ id, confirmed_value })
  }
}
