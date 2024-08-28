export type InputImageAI = {
  imagePath: string
  mimeType: string
  displayName: string
}

export interface AnalizeImageAI {
  upload(inputImageAI: InputImageAI): Promise<string>
}
