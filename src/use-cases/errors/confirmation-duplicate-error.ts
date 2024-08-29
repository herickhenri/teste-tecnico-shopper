export class ConfirmationDuplicateError extends Error {
  public readonly description: string

  constructor(description: string = 'Leitura já confirmada') {
    super('CONFIRMATION_DUPLICATE_ERROR')
    this.description = description
  }
}
