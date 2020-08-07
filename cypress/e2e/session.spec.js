describe("signup", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("allows the creation of new users", () => {
    cy.get(".sign-up-button").as("btnSignup");
    cy.get("@btnSignup").click();

    cy.get("form").as("form");
    cy.contains("email")
      .click()
      .type("debtbot@debtcollective.org");
  });
});
