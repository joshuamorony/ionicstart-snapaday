import {
  getPhotoList,
  getTakePhotoButton,
  navigateToHomePage,
} from 'cypress/support/utils';

describe('Home', () => {
  beforeEach(() => {
    navigateToHomePage();
  });

  it('can take a photo and display it', () => {
    getTakePhotoButton().click();
    getPhotoList().should('have.length.above', 0);
  });
});
