import { ConfirmationDuplicateError } from '../errors/confirmation-duplicate-error.js';
import { MeasureNotFoundError } from '../errors/measure-not-found-error.js';
export class ConfirmMeasureUseCases {
    measuresRepository;
    constructor(measuresRepository) {
        this.measuresRepository = measuresRepository;
    }
    async execute({ id, confirmed_value }) {
        const measureFind = await this.measuresRepository.findById(id);
        if (!measureFind) {
            throw new MeasureNotFoundError();
        }
        if (measureFind.has_confirmed) {
            throw new ConfirmationDuplicateError();
        }
        await this.measuresRepository.confirm({ id, confirmed_value });
    }
}
