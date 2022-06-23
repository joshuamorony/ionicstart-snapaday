export * from './home';

Cypress.on('window:before:load', (win) => {
  win.indexedDB.deleteDatabase('_ionicstorage');
});
