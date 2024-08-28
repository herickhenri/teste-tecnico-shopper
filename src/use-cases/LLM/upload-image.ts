import { AnalizeImageAI, InputImageAI } from '../../LLM/analize-image-LLM.js'
import { InvalidDataError } from '../errors/invalid-data-error.js'

interface UploadImageRequest extends InputImageAI {}

const mimeTypesAccepted = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
]

export class UploadImageUseCases {
  constructor(private analizeImageIA: AnalizeImageAI) {}

  async execute({ displayName, imagePath, mimeType }: UploadImageRequest) {
    if (!mimeTypesAccepted.includes(mimeType)) {
      throw new InvalidDataError()
    }

    const response = await this.analizeImageIA.upload({
      displayName,
      imagePath,
      mimeType,
    })

    const value = Number(response.match(/\d+/))

    return { value }
  }
}
