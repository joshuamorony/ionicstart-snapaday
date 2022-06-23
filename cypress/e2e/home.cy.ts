import {
  getDaysAgoLabel,
  getDeletePhotoButton,
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

  it('should be able to delete a photo', () => {
    takePhoto();
    getDeletePhotoButton().first().click({ force: true });
    getPhotoList().children().should('not.exist');
  });

  it('should display days ago label on photo', () => {
    takePhoto();
    getDaysAgoLabel().should('contain.text', 'today');
  });
});
