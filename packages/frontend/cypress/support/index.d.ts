declare namespace Cypress {
  interface Chainable {
    /**
     * Logs a user in.
     */
    loginUser(email: string, password: string): Chainable<Element>;
    /**
     * Registers a user.
     */
    registerUser(email: string, password: string): Chainable<Element>;
    /**
     * Deletes a user if possible.
     */
    deleteUser(email: string, password: string): Chainable<Element>;
    /**
     * Logs out a user.
     *
     * It is assumed that the user has logged in already.
     */
    logout(): Chainable<Element>;
  }
}
