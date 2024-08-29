import { GoogleAIFileManager } from '@google/generative-ai/server';
import { env } from '../../env/index.js';
import { genAI } from '../../lib/genAIClient.js';
export class AnalizeImageGeminiAILLM {
    async upload({ imagePath, mimeType }) {
        const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
        const uploadResponse = await fileManager.uploadFile(imagePath, {
            mimeType,
        });
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
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
        ]);
        return result.response.text();
    }
}
