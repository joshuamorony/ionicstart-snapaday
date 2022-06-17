export const navigateToHomePage = () => cy.visit('/');

export const getPhotoList = () => cy.get('[data-test="photo-list"]');

export const getTakePhotoButton = () =>
  cy.get('[data-test="take-photo-button"]');
