export class MeasuresNotFoundError extends Error {
    description;
    constructor(description = 'Nenhum registro encontrado') {
        super('MEASURES_NOT_FOUND');
        this.description = description;
    }
}
