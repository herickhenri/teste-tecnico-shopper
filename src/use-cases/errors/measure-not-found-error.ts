export class MeasureNotFoundError extends Error {
  public readonly description: string

  constructor(description: string = 'Leitura não encontrada') {
    super('MEASURES_NOT_FOUND')
    this.description = description
  }
}
