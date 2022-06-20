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
    cy.wait(300);
    getShutterButton().click();
    cy.wait(300);
    getAcceptPhotoButton().click();
    getPhotoList().children().should('have.length.greaterThan', 0);
  });
});
