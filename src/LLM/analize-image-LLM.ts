export type InputImage = {
  imagePath: string
  mimeType: string
}

export interface AnalizeImageLLM {
  upload(inputImage: InputImage): Promise<string>
}
