import { InMemoryMeasuresRepository } from '../../repositories/in-memory/in-memory-measures-repository.js'
import { CreateMeasureUseCases } from './create-measure.js'
import { UploadImageUseCases } from '../LLM/upload-image.js'
import { AnalizeImageMockLLM } from '../../LLM/mock-LLM/upload-image-mock-LLM.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { DoubleReportError } from '../errors/double-report-error.js'

let measuresRepository: InMemoryMeasuresRepository
let uploadImage: UploadImageUseCases
let analizeImageMockLLM: AnalizeImageMockLLM
let sut: CreateMeasureUseCases

describe('Create Measure Use Case', () => {
  beforeEach(() => {
    measuresRepository = new InMemoryMeasuresRepository()
    analizeImageMockLLM = new AnalizeImageMockLLM()
    uploadImage = new UploadImageUseCases(analizeImageMockLLM)
    sut = new CreateMeasureUseCases(measuresRepository, uploadImage)
  })

  it('shoud be able to create new measure', async () => {
    const { measure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    expect(measure).toMatchObject({
      id: expect.any(String),
      customer_code: 'example-customer-code',
      image_url: 'example-image-url',
      value: expect.any(Number),
      has_confirmed: false,
      type: 'WATER',
      datetime: expect.any(Date),
    })
  })

  it('shoud not be able to create new measure if there is already a reading for this month', async () => {
    await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    expect(
      async () =>
        await sut.execute({
          image_url: 'example-image-url',
          datetime: new Date(),
          type: 'WATER',
          customer_code: 'example-customer-code',
          imageInput: {
            displayName: 'image-example',
            imagePath: 'example-image-path',
            mimeType: 'image/jpeg',
          },
        }),
    ).rejects.toBeInstanceOf(DoubleReportError)
  })

  it('shoud be able to create two measurements of different types in the same month', async () => {
    const { measure: firstMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'GAS',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    const { measure: secondMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    expect(firstMeasure).contains({ type: 'GAS' })
    expect(secondMeasure).contains({ type: 'WATER' })
  })

  it('shoud be able to create two measurements of different customer in the same month', async () => {
    const { measure: firstMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'customer-one',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    const { measure: secondMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(),
      type: 'WATER',
      customer_code: 'customer-two',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    expect(firstMeasure).contains({ type: 'WATER' })
    expect(secondMeasure).contains({ type: 'WATER' })
  })

  it('shoud be able to create two measurements equals in different months', async () => {
    const { measure: firstMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(2024, 7, 1),
      type: 'WATER',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    const { measure: secondMeasure } = await sut.execute({
      image_url: 'example-image-url',
      datetime: new Date(2024, 8, 1),
      type: 'WATER',
      customer_code: 'example-customer-code',
      imageInput: {
        displayName: 'image-example',
        imagePath: 'example-image-path',
        mimeType: 'image/jpeg',
      },
    })

    expect(firstMeasure).contains({ type: 'WATER' })
    expect(secondMeasure).contains({ type: 'WATER' })
  })
})
