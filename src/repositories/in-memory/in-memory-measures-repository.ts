import { randomUUID } from 'crypto'
import {
  ConfirmMeasureInput,
  Measure,
  MeasureInput,
  MeasuresRepository,
} from '../measures-repository.js'

export class InMemoryMeasuresRepository implements MeasuresRepository {
  #measures: Measure[] = []

  async findById(id: string) {
    const measure = this.#measures.find((measure) => measure.id === id)

    if (!measure) return null

    return measure
  }

  async findByCustomerCode(customerCode: string): Promise<Measure[] | null> {
    const measures = this.#measures.filter(
      ({ customer_code }) => customer_code === customerCode,
    )

    if (!measures.length) return null

    return measures
  }

  async create({
    image_url,
    datetime,
    type,
    value,
    customer_code,
  }: MeasureInput) {
    const measure = {
      id: randomUUID(),
      has_confirmed: false,
      image_url,
      datetime,
      type,
      value,
      customer_code,
    }

    this.#measures.push(measure)

    return measure
  }

  async confirm({ id, confirmed_value }: ConfirmMeasureInput): Promise<void> {
    this.#measures = this.#measures.map((measure) =>
      measure.id === id
        ? { ...measure, confirmed_value, has_confirmed: true }
        : measure,
    )
  }
}
