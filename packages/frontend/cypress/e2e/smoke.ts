describe('smoke', () => {
  it('shows home page', () => {
    cy.visit('/');
    cy.contains(/What we are about/i).should('exist');
  });
});
