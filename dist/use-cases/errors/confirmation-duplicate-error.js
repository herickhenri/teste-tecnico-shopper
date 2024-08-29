export class ConfirmationDuplicateError extends Error {
    description;
    constructor(description = 'Leitura já confirmada') {
        super('CONFIRMATION_DUPLICATE_ERROR');
        this.description = description;
    }
}
