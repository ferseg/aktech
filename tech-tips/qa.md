# quality assurance


```ts
import { beforeEach } from 'mocha';
import { generatePerson } from 'cypress/support/dataGenerators';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Add element to Web Table', function () {
    const person = generatePerson();
  beforeEach(function () {
    cy.visit('/');
    cy.contains('Elements').click();
    cy.contains('Web Tables').click();
    cy.get('#addNewRecordButton').click();
  });
  it('Should be successful when info is ok', function () {
    cy.get('#firstName').type('firstName');
    cy.get('#lastName').type('Murph');
    cy.get('#userEmail').type('polo@gmail.com');
    cy.get('#age').type('2');
    cy.get('#salary').type('1500');
    cy.get('#department').type('Legal');
    cy.get('.modal-body').contains('Submit').click();
    cy.get('.rt-table').contains('.rt-td', 'firstName').should('be.visible');
  }),
    it('Should be an error when email is not correct', function () {
      cy.get('#firstName').type('Polo');
      cy.get('#lastName').type('Murph');
      cy.get('#userEmail').type('polo');
      cy.get('#age').type('2');
      cy.get('#salary').type('1500');
      cy.get('#department').type('Legal');
      cy.get('.modal-body').contains('Submit').click();
      cy.get('#userEmail').should(
        'have.css',
        'border-color',
        'rgb(220, 53, 69)',
      );
    });
});
```

```ts
import { generatePerson } from 'cypress/support/dataGenerators';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Add element to Web Table', function () {
  const person = generatePerson();
  before(function () {
    cy.visit('/');
    cy.goToWebTables();
    cy.openAddNewRecordScreen();
  });
  it('Should be successful when info is ok', function () {
    cy.fillPersonInputs(person);
    cy.submitPerson();
    cy.assertPersonIsDisplayed(person.firstName);
  }),
    it('Should give an error when email is not correct', function () {
      person.userEmail = person.firstName;
      cy.fillPersonInputs(person);
      cy.submitPerson();
      cy.assertEmailInputIsRed();
    });
});
```
