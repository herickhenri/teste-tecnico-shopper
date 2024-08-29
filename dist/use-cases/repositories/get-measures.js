import { MeasuresNotFoundError } from '../errors/measures-not-found-error.js';
export class GetMeasuresUseCases {
    measuresRepository;
    constructor(measuresRepository) {
        this.measuresRepository = measuresRepository;
    }
    async execute({ type, customer_code }) {
        let measures = await this.measuresRepository.findByCustomerCode(customer_code);
        if (type) {
            const measuresFiltered = type && measures?.filter((measure) => measure.type === type);
            measures = measuresFiltered || null;
        }
        if (!measures || measures.length === 0) {
            throw new MeasuresNotFoundError();
        }
        return { measures };
    }
}
