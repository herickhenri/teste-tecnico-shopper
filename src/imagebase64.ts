import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs'
import { fileURLToPath } from 'url'

const imagesDir = new URL('./tmp/uploads/test.jpg', import.meta.url)

fileURLToPath(imagesDir)

const image = fs.readFileSync(imagesDir)

const base64 = image.toString('base64')

const buffer = Buffer.from(base64, 'base64')

// const initialBase64 = base64.substring(0, 200)

console.log(await fileTypeFromBuffer(buffer))
