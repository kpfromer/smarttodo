// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe('user', () => {
  const username = 'email@example.com';
  const password = 'password';
  // todo:
  beforeEach(() => {
    cy.log('Deleting user.');
    // since we are creating users
    cy.deleteUser(username, password);
  });
  it('can login', () => {
    // Setup
    cy.registerUser('email@example.com', 'password');
    cy.logout();

    // Start
    cy.visit('/');
    cy.contains(/login/i).click();
    cy.findByLabelText(/email/i).type('email@example.com');
    cy.findByLabelText(/password/i).type('password');

    cy.contains('button', /login/i).click();

    // Projects should exists
    cy.contains(/projects/i).should('exist');
    cy.contains(/default/i).should('exist');
  });

  it('can register', () => {
    cy.visit('/');
    cy.contains(/register/i).click();
    cy.findByLabelText(/email/i).type('email@example.com');
    cy.findByLabelText(/^password$/i).type('password');
    cy.findByLabelText(/confirm password/i).type('password');

    cy.contains('button', /register/i).click();

    // Projects should exists
    cy.contains(/projects/i).should('exist');
    cy.contains(/default/i).should('exist');
  });

  it('fails to register if passwords do not match', () => {
    cy.visit('/');
    cy.contains(/register/i).click();
    cy.findByLabelText(/email/i).type('email@example.com');
    cy.findByLabelText(/^password$/i).type('password');
    cy.findByLabelText(/confirm password/i).type('different password');

    cy.contains('button', /register/i).click();

    cy.findByText(/Passwords must match/i).should('exist');
  });

  it('fails to register if email already exists', () => {
    // Setup
    cy.registerUser('email@example.com', 'password');
    cy.logout();

    // Start
    cy.visit('/');
    cy.contains(/register/i).click();
    cy.findByLabelText(/email/i).type('email@example.com');
    cy.findByLabelText(/^password$/i).type('password');
    cy.findByLabelText(/confirm password/i).type('password');

    cy.contains('button', /register/i).click();

    // Projects should exists
    cy.findByText(/User with that email already exists!/i).should('exist');
  });
});
