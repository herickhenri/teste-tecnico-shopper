export class InvalidTypeError extends Error {
  public readonly description: string

  constructor(
    description: string = 'Parâmetro measure type diferente de WATER ou GAS',
  ) {
    super('INVALID_TYPE')
    this.description = description
  }
}
