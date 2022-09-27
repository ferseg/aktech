# quality assurance

## automation good practice - screenplay pattern 

the screenplay pattern is a user-centered approach to writing high-quality automated acceptance tests. Instead of focusing on low-level, interface-centric interactions, you describe your test scenarios in a similar way you'd describe them to a human being - an actor in Screenplay-speak. You write simple, readable and highly-reusable code that instructs the actors what activities to perform and what things to check. 

- avoid commands execution on the test (i.e click, type, assertions…), by the contrary, encapsulate such commands into reusable functions

- use meaningful names on each variable, functions, class, file and enum; make sure the name reveals user actions (i.e fillLogInnputFields(username:string, password:string))

- code reusable functions to avoid code duplicated


*in this example, the previous 3 rules are violated under the screenplay pattern* 

notice granular amount of commands such as click and type; also the repeated code in both tests.

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


*for instance, the test can be coded way better like this* 

notice how readable the test is, it simulates user actions and also the functions fillPersonInputs and submitPerson can be reuse in both tests.

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

> ing. nahomy moya
