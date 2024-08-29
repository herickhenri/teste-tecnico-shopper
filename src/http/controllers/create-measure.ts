import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateMeasureUseCases } from '../../use-cases/repositories/create-measure.js'
import { PrismaMeasuresRepository } from '../../repositories/prisma/prisma-measures-repository.js'
import { AnalizeImageGeminiAILLM } from '../../LLM/gemini-AI-LLM/analize-image-gemini-AI-LLM.js'
import fs from 'node:fs/promises'
import { imagesDir } from '../../app.js'
import { randomUUID } from 'node:crypto'
import { fileTypeFromBuffer } from 'file-type'
import { InvalidDataError } from '../../use-cases/errors/invalid-mimetype-error.js'
import { DoubleReportError } from '../../use-cases/errors/double-report-error.js'

export async function createMeasure(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const measureBodySchema = z.object({
    image: z.string(),
    customer_code: z.string(),
    measure_datetime: z.coerce.date(),
    measure_type: z.enum(['WATER', 'GAS']),
  })

  const data = measureBodySchema.parse(request.body)

  const buffer = Buffer.from(data.image, 'base64')
  const fileType = await fileTypeFromBuffer(buffer)

  if (!fileType) {
    throw new InvalidDataError()
  }

  const imageName = `${randomUUID()}.${fileType.ext}`
  const imagePath = `${imagesDir}/${imageName}`

  await fs.writeFile(imagePath, buffer).catch(() => {
    throw new Error()
  })

  try {
    const measuresRepository = new PrismaMeasuresRepository()
    const analizeImageLLM = new AnalizeImageGeminiAILLM()
    const createMeasureUseCases = new CreateMeasureUseCases(
      measuresRepository,
      analizeImageLLM,
    )

    const { measure } = await createMeasureUseCases.execute({
      customer_code: data.customer_code,
      datetime: data.measure_datetime,
      type: data.measure_type,
      image_url: `http://localhost:3333/images/${imageName}`,
      imageInput: {
        imagePath,
        mimeType: fileType.mime,
      },
    })

    return reply.status(200).send({
      image_url: measure.image_url,
      measure_value: measure.value,
      measure_uuid: measure.id,
    })
  } catch (err) {
    await fs.unlink(imagePath)

    if (err instanceof InvalidDataError) {
      return reply
        .status(400)
        .send({ error_code: err.message, error_description: err.description })
    }
    if (err instanceof DoubleReportError) {
      return reply.status(409).send({
        error_code: err.message,
        error_description: err.description,
      })
    }

    throw err
  }
}
