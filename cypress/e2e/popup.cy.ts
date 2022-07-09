/// <reference types="cypress" />
/// <reference types="chrome"/>

describe('configs popup', () => {
  beforeEach(() => {
    //chrome.storage.sync.clear();
    cy.visit('https://trello.com/b/UV8x4jC3/academic-literature-review');
  });

  it('have a title', () => {
    cy.get('.card-short-id.hide').should('have.length', 5);
  });
});
