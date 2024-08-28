import { AnalizeImageLLM } from '../analize-image-LLM.js'

export class AnalizeImageMockLLM implements AnalizeImageLLM {
  async upload() {
    return '12345'
  }
}
