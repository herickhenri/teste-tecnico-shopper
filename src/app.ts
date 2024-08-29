import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { appRoutes } from './http/routes.js'
import { fileURLToPath } from 'url'
import { ZodError } from 'zod'
import fs from 'node:fs/promises'

export const app = fastify()

const imagesDirURL = new URL('./tmp/uploads', import.meta.url)
export const imagesDir = fileURLToPath(imagesDirURL)
await fs.mkdir(imagesDir, { recursive: true })

app.register(cors, {
  origin: true,
})

app.register(fastifyStatic, {
  root: imagesDir,
  prefix: '/images/',
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error_code: 'INVALID_DATA',
      error_description:
        'Os dados fornecidos no corpo da requisição são inválidos',
    })
  }

  console.error(error)

  reply.status(500).send({ message: 'Internal server error.' })
})
