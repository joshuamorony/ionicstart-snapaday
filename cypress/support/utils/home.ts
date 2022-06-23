export const navigateToHomePage = () => cy.visit('/');

export const getPhotoList = () => cy.get('[data-test="photo-list"]');

export const getTakePhotoButton = () =>
  cy.get('[data-test="take-photo-button"]');

const getCameraModal = () =>
  cy.get('pwa-camera-modal-instance').shadow().find('pwa-camera').shadow();

export const getShutterButton = () => getCameraModal().find('.shutter-button');
export const getAcceptPhotoButton = () => getCameraModal().find('.accept-use');

export const takePhoto = () => {
  getTakePhotoButton().click();
  cy.wait(300);
  getShutterButton().click();
  cy.wait(300);
  getAcceptPhotoButton().click();
};
