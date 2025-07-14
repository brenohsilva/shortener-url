import { User } from 'generated/prisma';

export class UserPresenter {
  constructor(readonly user: User) {}

  toJSON() {
    return {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
    };
  }
}
