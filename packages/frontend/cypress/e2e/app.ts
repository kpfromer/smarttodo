describe('logged in app', () => {
  const username = 'email@example.com';
  const password = 'password';

  beforeEach(() => {
    // Lands users at /app
    cy.loginUser(username, password);
  });
  it('creates a todo', () => {
    cy.get('input').type('new todo');
    cy.contains('button', /create/i).click();

    // Clears input
    cy.get('input').should('not.have.value');
    // has item
    cy.contains('new todo').should('exist');
    cy.findByTestId('todo-checkbox').should('not.be.checked');
  });

  it('creates a project');

  it('checks / unchecks todo item', () => {
    // TODO: extract out to command
    cy.get('input').type('new todo');
    cy.contains('button', /create/i).click();

    cy.get('input').should('not.have.value');

    cy.findByTestId('todo-checkbox').check({ force: true });
    cy.findByTestId('todo-checkbox').should('be.checked');

    cy.findByTestId('todo-checkbox').uncheck({ force: true });
    cy.findByTestId('todo-checkbox').should('not.be.checked');
  });

  it('deletes a todo', () => {
    // TODO: extract out to command
    cy.get('input').type('new todo');
    cy.contains('button', /create/i).click();

    // Clears input
    cy.get('input').should('not.have.value');
    cy.contains('new todo').trigger('mouseover');

    cy.findByTestId('todo-delete').click();

    cy.contains('new todo').should('not.exist');
  });
  it("edits a todo's name");
});
