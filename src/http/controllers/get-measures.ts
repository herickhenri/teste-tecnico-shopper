import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaMeasuresRepository } from '../../repositories/prisma/prisma-measures-repository.js'
import { GetMeasuresUseCases } from '../../use-cases/repositories/get-measures.js'
import { InvalidTypeError } from '../../use-cases/errors/invalid-type-error.js'
import { MeasuresNotFoundError } from '../../use-cases/errors/measures-not-found-error.js'

type MeasureType = 'WATER' | 'GAS'

export async function getMeasure(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    customer_code: z.string(),
  })
  const requestQuerySchema = z.object({
    measure_type: z
      .string()
      .transform((type) => type.toUpperCase() as MeasureType)
      .refine((type) => ['WATER', 'GAS'].includes(type))
      .optional(),
  })

  const { customer_code } = requestParamsSchema.parse(request.params)
  const { measure_type } = requestQuerySchema.parse(request.query)

  try {
    const measuresRepository = new PrismaMeasuresRepository()
    const getMeasureUseCases = new GetMeasuresUseCases(measuresRepository)

    const { measures } = await getMeasureUseCases.execute({
      customer_code,
      type: measure_type,
    })

    const measuresFormatted = measures.map(
      ({ id, datetime, type, has_confirmed, image_url }) => ({
        measure_uuid: id,
        measure_datetime: datetime,
        measure_type: type,
        has_confirmed,
        image_url,
      }),
    )

    return reply
      .status(200)
      .send({ customer_code, measures: measuresFormatted })
  } catch (err) {
    if (err instanceof InvalidTypeError) {
      return reply.status(400).send({ error_code: err.message })
    }
    if (err instanceof MeasuresNotFoundError) {
      return reply.status(404).send({ error_code: err.message })
    }

    throw err
  }
}
