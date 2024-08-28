import { AnalizeImageLLM } from '../analize-image-LLM.js'

export class AnalizeImageMockLLM implements AnalizeImageLLM {
  async upload(): Promise<string> {
    return '12345'
  }
}
