export const navigateToHomePage = () => cy.visit('/');

export const getTakePhotoButton = () =>
  cy.get('[data-test="take-photo-button"]');
