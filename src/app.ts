import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { appRoutes } from './http/routes.js'
import { fileURLToPath } from 'url'

export const app = fastify()

const imagesDirURL = new URL('./tmp/uploads', import.meta.url)
export const imagesDir = fileURLToPath(imagesDirURL)

app.register(cors, {
  origin: true,
})

app.register(fastifyStatic, {
  root: imagesDir,
  prefix: '/images/',
})

app.register(appRoutes)
