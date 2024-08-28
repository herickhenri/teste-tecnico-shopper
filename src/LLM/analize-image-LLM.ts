export type InputImage = {
  imagePath: string
  mimeType: string
  displayName: string
}

export interface AnalizeImageLLM {
  upload(inputImage: InputImage): Promise<string>
}
