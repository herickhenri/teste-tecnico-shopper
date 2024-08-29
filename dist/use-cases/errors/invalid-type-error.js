export class InvalidTypeError extends Error {
    description;
    constructor(description = 'Parâmetro measure type diferente de WATER ou GAS') {
        super('INVALID_TYPE');
        this.description = description;
    }
}
