describe("login", () => {
  it("allows to login an existing user", () => {
    cy.createUser().then(user => {
      cy.visit("/");
      cy.get("header.d-header")
        .findByText(/log in/i)
        .click();

      // Fill up the login form
      cy.findByLabelText(/^user$/i).type(user.username);
      cy.findByLabelText(/password/i).type(user.password);
      cy.get("#discourse-modal")
        .findByRole("button", { name: /log in/i })
        .click();

      cy.assertHome();
      cy.assertLoggedInAs(user);
    });
  });
});
