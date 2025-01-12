export class UpdateUserCredentialParams {
  constructor(
    public readonly userId: string,
    public readonly email?: string,
    public readonly passwordHash?: string,
  ) {}
}
