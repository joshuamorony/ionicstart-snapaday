import {
  getPhotoList,
  getTakePhotoButton,
  navigateToHomePage,
} from 'cypress/support/utils';

describe('Home', () => {
  beforeEach(() => {
    navigateToHomePage();
  });

  it('can trigger taking a photo', () => {
    getTakePhotoButton().click();
  });
});
