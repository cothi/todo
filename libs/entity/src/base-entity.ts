export type BaseEntityProps = {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
};
export abstract class BaseEntity<TProps extends BaseEntityProps> {
  protected constructor(protected props: TProps) {}

  get id(): string {
    return this.props.id;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected updateTimestamp(): void {
    this.props.updatedAt = new Date();
  }

  abstract update(partialProps: Partial<TProps>): void;
}
