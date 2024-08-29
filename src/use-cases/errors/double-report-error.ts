export class DoubleReportError extends Error {
  public readonly description: string

  constructor(
    description: string = 'Já existe uma leitura para este tipo no mês atual',
  ) {
    super('DOUBLE_REPORT')
    this.description = description
  }
}
