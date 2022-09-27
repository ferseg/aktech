# quality assurance

## automation good practice - screenplay pattern 

the screenplay pattern is a user-centered approach to writing high-quality automated acceptance tests. Instead of focusing on low-level, interface-centric interactions, you describe your test scenarios in a similar way you'd describe them to a human being - an actor in Screenplay-speak. You write simple, readable and highly-reusable code that instructs the actors what activities to perform and what things to check. 

basic principles 

- avoid commands execution on the test (i.e click, type, assertions…), by the contrary, encapsulate such commands into reusable functions

- use meaningful names on each variable, functions, class, file and enum; make sure the name reveals user actions (i.e fillLogInputFields(username:string, password:string))

- write reusable functions to avoid duplicated code


### _the following code example violated the 3 previous principles_  

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
notice the granular amount of commands such as click and type; also the repeated code in both tests.

### _for instance, a way better code would be this_

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
notice how readable the test is, it simulates user actions, also, the functions fillPersonInputs and submitPerson are used in both tests.

> ing. nahomy moya
