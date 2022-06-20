import {
  getAcceptPhotoButton,
  getPhotoList,
  getShutterButton,
  getTakePhotoButton,
  navigateToHomePage,
} from 'cypress/support/utils';

describe('Home', () => {
  beforeEach(() => {
    navigateToHomePage();
  });

  it('can take a photo', () => {
    getTakePhotoButton().click();
    getShutterButton().click();
    getAcceptPhotoButton().click();
    getPhotoList().children().should('have.length');
  });
});
