import { prisma } from '../../lib/prisma.js';
export class PrismaMeasuresRepository {
    async findById(id) {
        const measure = await prisma.measure.findUnique({
            where: { id },
        });
        if (!measure)
            return null;
        return measure;
    }
    async findByCustomerCode(customerCode) {
        const measures = await prisma.measure.findMany({
            where: { customer_code: customerCode },
        });
        return measures;
    }
    async create({ image_url, datetime, type, value, customer_code, }) {
        const customer = await prisma.customer.upsert({
            where: { id: customer_code },
            update: {},
            create: {
                id: customer_code,
            },
        });
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
        });
        return measure;
    }
    async confirm({ id, confirmed_value }) {
        await prisma.measure.update({
            where: { id },
            data: {
                confirmed_value,
                has_confirmed: true,
            },
        });
    }
}
