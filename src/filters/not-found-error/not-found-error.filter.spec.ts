import { UserNotFoundErrorFilter } from './not-found-error.filter';

describe('NotFoundErrorFilter', () => {
  it('should be defined', () => {
    expect(new UserNotFoundErrorFilter()).toBeDefined();
  });
});
