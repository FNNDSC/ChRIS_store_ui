import RelativeDate from './RelativeDate';

describe('Date', () => {
  it('should determine that a valid date is valid', () => {
    const relativeDate = new RelativeDate('3/14/15');
    expect(relativeDate.isValid()).toBeTruthy();
  });

  it('should determine that an invalid date is invalid', () => {
    const relativeDate = new RelativeDate('invalid date');
    expect(relativeDate.isValid()).toBeFalsy();
  });

  it('should format dates correctly', () => {
    const date = new Date();
    const yesterday = date.setDate(date.getDate() - 1);
    const relativeDate = new RelativeDate(yesterday);
    expect(relativeDate.format()).toEqual('a day ago');
  });
});
