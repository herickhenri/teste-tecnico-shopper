import { GoogleAIFileManager } from '@google/generative-ai/server'
import { env } from './env/index.js'
import { genAI } from './lib/genAIClient.js'

const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY)

const uploadResponse = await fileManager.uploadFile('medidor-eletrico.jpg', {
  mimeType: 'image/jpeg',
  displayName: 'Jeckpack drawing',
})

console.log(
  `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
)

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
    text: 'Não explique nada, retorne exclusivamente o valor numérico medido por esse medidor de energia',
  },
])

console.log(result.response.text())
