import { FastifyInstance } from 'fastify'
import { createMeasure } from './controllers/create-measure.js'
import { confirmMeasure } from './controllers/confirm-measure.js'

export async function appRoutes(app: FastifyInstance) {
  app.post('/upload', createMeasure)
  app.patch('/confirm', confirmMeasure)
}
