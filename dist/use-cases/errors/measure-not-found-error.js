export class MeasureNotFoundError extends Error {
    description;
    constructor(description = 'Leitura não encontrada') {
        super('MEASURES_NOT_FOUND');
        this.description = description;
    }
}
