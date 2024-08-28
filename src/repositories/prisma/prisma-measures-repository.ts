import {
  ConfirmMeasureInput,
  Measure,
  MeasureInput,
  MeasuresRepository,
} from '../measures-repository.js'
import { prisma } from '../../lib/prisma.js'

export class PrismaMeasuresRepository implements MeasuresRepository {
  async findById(id: string) {
    const measure = await prisma.measure.findUnique({
      where: { id },
    })

    if (!measure) return null

    return measure
  }

  async findByCustomerCode(customerCode: string): Promise<Measure[] | null> {
    const measures = await prisma.measure.findMany({
      where: { customer_code: customerCode },
    })

    return measures
  }

  async create({
    image_url,
    datetime,
    type,
    value,
    customer_code,
  }: MeasureInput) {
    const customer = await prisma.customer.upsert({
      where: { id: customer_code },
      update: {},
      create: {
        id: customer_code,
      },
    })

    const measure = await prisma.measure.create({
      data: {
        datetime,
        image_url,
        type,
        value,
        has_confirmed: false,
        customer: {
          connect: { id: customer.id },
        },
      },
    })

    return measure
  }

  async confirm({ id, confirmed_value }: ConfirmMeasureInput): Promise<void> {
    await prisma.measure.update({
      where: { id },
      data: {
        confirmed_value,
        has_confirmed: true,
      },
    })
  }
}
