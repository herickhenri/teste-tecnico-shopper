import { InMemoryMeasuresRepository } from '../../repositories/in-memory/in-memory-measures-repository.js'
import { ConfirmationDuplicateError } from '../errors/confirmation-duplicate-error.js'
import { MeasureNotFoundError } from '../errors/measure-not-found-error.js'
import { ConfirmMeasureUseCases } from './confirm-measure.js'
import { beforeEach, describe, expect, it } from 'vitest'

let measuresRepository: InMemoryMeasuresRepository
let sut: ConfirmMeasureUseCases

describe('Confirm Measure Use Case', () => {
  beforeEach(() => {
    measuresRepository = new InMemoryMeasuresRepository()
    sut = new ConfirmMeasureUseCases(measuresRepository)
  })

  it('shoud be able to confirm measure', async () => {
    const { id } = await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'example-customer-code',
      value: 12345,
    })

    await sut.execute({ id, confirmed_value: 12345 })

    const measure = await measuresRepository.findById(id)

    expect(measure).contains({ confirmed_value: 12345, has_confirmed: true })
  })

  it('shoud not be able to confirm measure not created', async () => {
    const id = 'no-exist-id'

    expect(
      async () => await sut.execute({ id, confirmed_value: 12345 }),
    ).rejects.toBeInstanceOf(MeasureNotFoundError)
  })

  it('shoud not be able to confirm measure has confirmed', async () => {
    const { id } = await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'example-customer-code',
      value: 12345,
    })

    await sut.execute({ id, confirmed_value: 12345 })

    expect(
      async () => await sut.execute({ id, confirmed_value: 12345 }),
    ).rejects.toBeInstanceOf(ConfirmationDuplicateError)
  })
})
