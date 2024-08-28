import { AnalizeImageAI } from '../analize-image-LLM.js'

export class AnalizeImageMockLLM implements AnalizeImageAI {
  async upload(): Promise<string> {
    return '12345'
  }
}
