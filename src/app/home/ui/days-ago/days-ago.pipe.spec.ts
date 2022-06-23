import { DaysAgoPipe } from './days-ago.pipe';

describe('DaysAgoPipe', () => {
  let pipe: DaysAgoPipe;
  let testDate: Date;

  beforeEach(() => {
    pipe = new DaysAgoPipe();
    testDate = new Date();
  });

  it('should convert todays date to today', () => {
    const result = pipe.transform(testDate.toString());
    expect(result).toEqual('today');
  });

  it('should convert yesterdays date to yesterday', () => {
    const result = pipe.transform(
      testDate.setDate(testDate.getDate() - 1).toString()
    );
    expect(result).toEqual('yesterday');
  });

  it('should convert 2 days ago to 2 days ago', () => {
    const result = pipe.transform(
      testDate.setDate(testDate.getDate() - 2).toString()
    );
    expect(result).toEqual('2 days ago');
  });

  it('should convert 20 days ago to 20 days ago', () => {
    const result = pipe.transform(
      testDate.setDate(testDate.getDate() - 20).toString()
    );
    expect(result).toEqual('20 days ago');
  });
});
