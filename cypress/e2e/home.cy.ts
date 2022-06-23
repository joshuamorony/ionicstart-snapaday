import {
  getPhotoList,
  getTakePhotoButton,
  navigateToHomePage,
  takePhoto,
} from 'cypress/support/utils';

describe('Home', () => {
  beforeEach(() => {
    navigateToHomePage();
  });

  it('can take a photo', () => {
    takePhoto();
    getPhotoList().children().should('have.length.greaterThan', 0);
  });

  it('can not take two photos', () => {
    takePhoto();
    getPhotoList().children().should('have.length.greaterThan', 0);
    getTakePhotoButton().should('have.attr', 'disabled');
  });
});
