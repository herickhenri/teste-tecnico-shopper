import { randomUUID } from 'crypto';
export class InMemoryMeasuresRepository {
    #measures = [];
    async findById(id) {
        const measure = this.#measures.find((measure) => measure.id === id);
        if (!measure)
            return null;
        return measure;
    }
    async findByCustomerCode(customerCode) {
        const measures = this.#measures.filter(({ customer_code }) => customer_code === customerCode);
        if (!measures.length)
            return null;
        return measures;
    }
    async create({ image_url, datetime, type, value, customer_code, }) {
        const measure = {
            id: randomUUID(),
            customer_code,
            image_url,
            value,
            datetime,
            type,
            has_confirmed: false,
            confirmed_value: null,
        };
        this.#measures.push(measure);
        return measure;
    }
    async confirm({ id, confirmed_value }) {
        this.#measures = this.#measures.map((measure) => measure.id === id
            ? { ...measure, confirmed_value, has_confirmed: true }
            : measure);
    }
}
