import { GoogleAIFileManager } from '@google/generative-ai/server'
import { AnalizeImageLLM, InputImage } from '../analize-image-LLM.js'
import { env } from '../../env/index.js'
import { genAI } from '../../lib/genAIClient.js'

export class AnalizeImageGeminiAiLLM implements AnalizeImageLLM {
  async upload({ displayName, imagePath, mimeType }: InputImage) {
    const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY)

    const uploadResponse = await fileManager.uploadFile(imagePath, {
      mimeType,
      displayName,
    })

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    })

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'Não explique nada, retorne exclusivamente o valor numérico medido por esse medidor',
      },
    ])

    return result.response.text()
  }
}
