export class MeasuresNotFoundError extends Error {
  public readonly description: string

  constructor(description: string = 'Nenhum registro encontrado') {
    super('MEASURES_NOT_FOUND')
    this.description = description
  }
}
