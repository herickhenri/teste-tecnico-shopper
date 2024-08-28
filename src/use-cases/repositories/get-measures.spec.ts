import { InMemoryMeasuresRepository } from '../../repositories/in-memory/in-memory-measures-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetMeasuresUseCases } from './get-measures.js'
import { MeasuresNotFoundError } from '../errors/measures-not-found-error.js'

let measuresRepository: InMemoryMeasuresRepository
let sut: GetMeasuresUseCases

describe('Get Measure Use Case', () => {
  beforeEach(() => {
    measuresRepository = new InMemoryMeasuresRepository()
    sut = new GetMeasuresUseCases(measuresRepository)
  })

  it('shoud be able to get measures', async () => {
    const customer_code = 'example-customer-code'

    await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code,
      value: 12345,
    })

    const { measures } = await sut.execute({ customer_code })

    expect(measures).toMatchObject([
      {
        id: expect.any(String),
        customer_code,
        image_url: 'example-image-url',
        value: expect.any(Number),
        has_confirmed: false,
        type: 'WATER',
        datetime: expect.any(Date),
      },
    ])
  })

  it('shoud not be able to get measurements that do not exist', async () => {
    const customer_code = 'example-customer-code'

    expect(
      async () => await sut.execute({ customer_code }),
    ).rejects.toBeInstanceOf(MeasuresNotFoundError)
  })

  it('shoud be able to get measurements only of just one type', async () => {
    const customer_code = 'example-customer-code'

    await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code,
      value: 12345,
    })
    await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'GAS',
      customer_code,
      value: 12345,
    })
    await measuresRepository.create({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code,
      value: 12345,
    })

    const { measures: measuresWater } = await sut.execute({
      customer_code,
      type: 'WATER',
    })
    const measuresTypeWater = measuresWater.map(({ type }) => type)

    const { measures: measuresGas } = await sut.execute({
      customer_code,
      type: 'GAS',
    })
    const measuresTypeGas = measuresGas.map(({ type }) => type)

    expect(measuresTypeWater).toEqual(['WATER', 'WATER'])
    expect(measuresTypeGas).toEqual(['GAS'])
  })
})
