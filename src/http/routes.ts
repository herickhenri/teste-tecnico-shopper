import { FastifyInstance } from 'fastify'
import { createMeasure } from './controllers/create-measure.js'

export async function appRoutes(app: FastifyInstance) {
  app.post('/upload', createMeasure)
}
