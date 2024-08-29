export class InvalidDataError extends Error {
    description;
    constructor(description = 'Formato de imagem não aceito') {
        super('INVALID_DATA');
        this.description = description;
    }
}
