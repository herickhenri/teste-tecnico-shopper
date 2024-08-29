export class InvalidDataError extends Error {
  public readonly description: string

  constructor(description: string = 'Formato de imagem não aceito') {
    super('INVALID_DATA')
    this.description = description
  }
}
