import { DoubleReportError } from '../errors/double-report-error.js';
import { InvalidDataError } from '../errors/invalid-mimetype-error.js';
const mimeTypesAccepted = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
];
export class CreateMeasureUseCases {
    measuresRepository;
    analizeImageLLM;
    constructor(measuresRepository, analizeImageLLM) {
        this.measuresRepository = measuresRepository;
        this.analizeImageLLM = analizeImageLLM;
    }
    async execute({ imageInput, image_url, datetime, type, customer_code, }) {
        const measures = await this.measuresRepository.findByCustomerCode(customer_code);
        const measureAlreadyExists = measures?.find((measure) => measure.customer_code === customer_code &&
            measure.datetime.getMonth() === datetime.getMonth() &&
            measure.datetime.getFullYear() === datetime.getFullYear() &&
            measure.type === type);
        if (measureAlreadyExists) {
            throw new DoubleReportError();
        }
        if (!mimeTypesAccepted.includes(imageInput.mimeType)) {
            throw new InvalidDataError();
        }
        const response = await this.analizeImageLLM.upload({
            imagePath: imageInput.imagePath,
            mimeType: imageInput.mimeType,
        });
        const value = Number(response.match(/\d+/));
        const measure = await this.measuresRepository.create({
            customer_code,
            datetime,
            type,
            value,
            image_url,
        });
        return { measure };
    }
}
