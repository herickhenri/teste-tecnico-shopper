import { InputImageAI } from '../../LLM/analize-image-LLM.js'
import { MeasuresRepository } from '../../repositories/measures-repository.js'
import { DoubleReportError } from '../errors/double-report-error.js'
import { UploadImageUseCases } from '../LLM/upload-image.js'

interface CreateMeasureRequest {
  imageInput: InputImageAI
  customer_code: string
  datetime: Date
  type: 'WATER' | 'GAS'
  image_url: string
}

export class CreateMeasureUseCases {
  constructor(
    private measuresRepository: MeasuresRepository,
    private uploadImage: UploadImageUseCases,
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

    const { value } = await this.uploadImage.execute(imageInput)

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
