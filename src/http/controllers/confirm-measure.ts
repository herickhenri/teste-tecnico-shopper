import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaMeasuresRepository } from '../../repositories/prisma/prisma-measures-repository.js'
import { InvalidDataError } from '../../use-cases/errors/invalid-data-error.js'
import { ConfirmMeasureUseCases } from '../../use-cases/repositories/confirm-measure.js'
import { ConfirmationDuplicateError } from '../../use-cases/errors/confirmation-duplicate-error.js'
import { MeasureNotFoundError } from '../../use-cases/errors/measure-not-found-error.js'

export async function confirmMeasure(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const confirmMeasureBodySchema = z.object({
    measure_uuid: z.string(),
    confirmed_value: z.number(),
  })

  const data = confirmMeasureBodySchema.parse(request.body)

  try {
    const measuresRepository = new PrismaMeasuresRepository()
    const confirmMeasureUseCases = new ConfirmMeasureUseCases(
      measuresRepository,
    )

    await confirmMeasureUseCases.execute({
      confirmed_value: data.confirmed_value,
      id: data.measure_uuid,
    })

    return reply.status(200).send({ success: true })
  } catch (err) {
    if (err instanceof InvalidDataError) {
      return reply.status(400).send({ error_code: err.message })
    }
    if (err instanceof MeasureNotFoundError) {
      return reply.status(404).send({ error_code: err.message })
    }
    if (err instanceof ConfirmationDuplicateError) {
      return reply.status(409).send({ error_code: err.message })
    }

    throw err
  }
}
