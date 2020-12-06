// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

const backendUrl = 'http://localhost:4000/graphql';

Cypress.Commands.add('registerUser', (email, password) => {
  cy.log(`Register user with email "${email}" and password "${password}"`);

  cy.visit('/');
  cy.contains(/register/i).click();
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/^password$/i).type(password);
  cy.findByLabelText(/confirm password/i).type(password);

  cy.contains('button', /register/i).click();

  // Projects should exists
  cy.contains(/projects/i).should('exist');
  cy.contains(/default/i).should('exist');
});

Cypress.Commands.add('logout', () => {
  cy.log('Logging out.');

  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.Commands.add('loginUser', (email, password) => {
  // Setup
  cy.deleteUser(email, password);
  cy.registerUser(email, password);
});

Cypress.Commands.add('deleteUser', (email, password) => {
  cy.log(`Deleting user with email "${email}" and password "${password}"`);
  cy.request({
    url: backendUrl, // assuming you've exposed a seeds route
    method: 'POST',
    body: {
      query: `
        mutation {
          login(email: "${email}", password:"${password}")
        }
      `,
    },
  }).then((res) => {
    // cy.log(res);

    if (res.body.errors && res.body.errors.length > 0) {
      cy.log('Invalid user. Ignoring logout.');
    } else {
      cy.log('Logged in. Deleting user.');
      const token = res.body.data.login;
      cy.request({
        url: backendUrl,
        method: 'POST',
        body: {
          query: `
            mutation {
              deleteUser
            }
          `,
        },
        headers: {
          Authorization: token,
        },
      });
    }

    // res.body.data.login
  });
});
