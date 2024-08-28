import { AnalizeImageLLM, InputImage } from '../../LLM/analize-image-LLM.js'
import { MeasuresRepository } from '../../repositories/measures-repository.js'
import { DoubleReportError } from '../errors/double-report-error.js'
import { InvalidDataError } from '../errors/invalid-data-error.js'

const mimeTypesAccepted = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
]

interface CreateMeasureRequest {
  imageInput: InputImage
  customer_code: string
  datetime: Date
  type: 'WATER' | 'GAS'
  image_url: string
}

export class CreateMeasureUseCases {
  constructor(
    private measuresRepository: MeasuresRepository,
    private analizeImageLLM: AnalizeImageLLM,
  ) {}

  async execute({
    imageInput,
    image_url,
    datetime,
    type,
    customer_code,
  }: CreateMeasureRequest) {
    const measures =
      await this.measuresRepository.findByCustomerCode(customer_code)

    const measureAlreadyExists = measures?.find(
      (measure) =>
        measure.customer_code === customer_code &&
        measure.datetime.getMonth() === datetime.getMonth() &&
        measure.datetime.getFullYear() === datetime.getFullYear() &&
        measure.type === type,
    )

    if (measureAlreadyExists) {
      throw new DoubleReportError()
    }

    if (!mimeTypesAccepted.includes(imageInput.mimeType)) {
      throw new InvalidDataError()
    }

    const response = await this.analizeImageLLM.upload({
      displayName: imageInput.displayName,
      imagePath: imageInput.imagePath,
      mimeType: imageInput.mimeType,
    })

    const value = Number(response.match(/\d+/))

    const measure = await this.measuresRepository.create({
      customer_code,
      datetime,
      type,
      value,
      image_url,
    })

    return { measure }
  }
}
