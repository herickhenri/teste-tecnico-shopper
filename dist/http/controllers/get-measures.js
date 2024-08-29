import { z } from 'zod';
import { PrismaMeasuresRepository } from '../../repositories/prisma/prisma-measures-repository.js';
import { GetMeasuresUseCases } from '../../use-cases/repositories/get-measures.js';
import { InvalidTypeError } from '../../use-cases/errors/invalid-type-error.js';
import { MeasuresNotFoundError } from '../../use-cases/errors/measures-not-found-error.js';
export async function getMeasure(request, reply) {
    const requestParamsSchema = z.object({
        customer_code: z.string(),
    });
    const requestQuerySchema = z.object({
        measure_type: z
            .string()
            .transform((type) => type.toUpperCase())
            .optional(),
    });
    const validationTypeSchema = z.enum(['WATER', 'GAS']);
    const { customer_code } = requestParamsSchema.parse(request.params);
    const { measure_type } = requestQuerySchema.parse(request.query);
    try {
        const type = await validationTypeSchema
            .parseAsync(measure_type)
            .catch(() => {
            throw new InvalidTypeError();
        });
        const measuresRepository = new PrismaMeasuresRepository();
        const getMeasureUseCases = new GetMeasuresUseCases(measuresRepository);
        const { measures } = await getMeasureUseCases.execute({
            customer_code,
            type,
        });
        const measuresFormatted = measures.map(({ id, datetime, type, has_confirmed, image_url }) => ({
            measure_uuid: id,
            measure_datetime: datetime,
            measure_type: type,
            has_confirmed,
            image_url,
        }));
        return reply
            .status(200)
            .send({ customer_code, measures: measuresFormatted });
    }
    catch (err) {
        if (err instanceof InvalidTypeError) {
            return reply
                .status(400)
                .send({ error_code: err.message, error_description: err.description });
        }
        if (err instanceof MeasuresNotFoundError) {
            return reply
                .status(404)
                .send({ error_code: err.message, error_description: err.description });
        }
        throw err;
    }
}
