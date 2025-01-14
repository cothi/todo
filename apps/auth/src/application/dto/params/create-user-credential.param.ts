export class CreateUserCredentialParam {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly passwordHash: string,
  ) {}
}