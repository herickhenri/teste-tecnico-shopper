export class DoubleReportError extends Error {
    description;
    constructor(description = 'Já existe uma leitura para este tipo no mês atual') {
        super('DOUBLE_REPORT');
        this.description = description;
    }
}
