import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly nickname?: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly birthday?: Date,
  ) {}
}
