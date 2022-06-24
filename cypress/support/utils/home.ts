export const navigateToHomePage = () => cy.visit('/');

export const getPhotoList = () => cy.get('[data-test="photo-list"]');
export const getDaysAgoLabel = () => cy.get('[data-test="days-ago-label"]');

export const getTakePhotoButton = () =>
  cy.get('[data-test="take-photo-button"]');

export const getSlideshowButton = () =>
  cy.get('[data-test="slideshow-button"]');

export const getSlideshowCloseButton = () =>
  cy.get('[data-test="slideshow-close-button"]');

export const getSlideshowModal = () => cy.get('app-slideshow');

export const getSlideshowPlayButton = () => cy.get('[data-test="play-button"]');

const getCameraModal = () =>
  cy.get('pwa-camera-modal-instance').shadow().find('pwa-camera').shadow();

export const getShutterButton = () => getCameraModal().find('.shutter-button');
export const getAcceptPhotoButton = () => getCameraModal().find('.accept-use');
export const getDeletePhotoButton = () =>
  cy.get('[data-test="delete-photo-button"]');

export const takePhoto = () => {
  getTakePhotoButton().click();
  cy.wait(300);
  getShutterButton().click();
  cy.wait(300);
  getAcceptPhotoButton().click();
};
