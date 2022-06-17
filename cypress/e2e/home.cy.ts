import { navigateToHomePage } from 'cypress/support/utils';

describe('Home', () => {
  beforeEach(() => {
    navigateToHomePage();
  });

  it('can take a photo and display it', () => {});
});
