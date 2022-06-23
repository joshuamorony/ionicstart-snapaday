import { DaysAgoPipe } from './days-ago.pipe';

describe('DaysAgoPipe', () => {
  let pipe: DaysAgoPipe;

  beforeEach(() => {
    pipe = new DaysAgoPipe();
  });

  it('should convert todays date to today', () => {
    const testDate = new Date().toISOString();
    const result = pipe.transform(testDate);
    expect(result).toEqual('today');
  });

  it('should convert yesterdays date to yesterday', () => {
    const testDate = new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toISOString();

    const result = pipe.transform(testDate);
    expect(result).toEqual('yesterday');
  });

  it('should convert 2 days ago to 2 days ago', () => {
    const testDate = new Date(
      new Date().setDate(new Date().getDate() - 2)
    ).toISOString();

    const result = pipe.transform(testDate);
    expect(result).toEqual('2 days ago');
  });

  it('should convert 20 days ago to 20 days ago', () => {
    const testDate = new Date(
      new Date().setDate(new Date().getDate() - 20)
    ).toISOString();

    const result = pipe.transform(testDate);
    expect(result).toEqual('20 days ago');
  });
});
