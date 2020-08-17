it.skip("allows user to see categories and its details", () => {
  cy.visit("/");
  cy.loginUser().then(user => {
    cy.get("#site-logo").click();

    cy.findByText(/lounge/i).click();
    cy.findByText(/about the lounge/i);
  });
});

it("allows user to see collectives and its details", () => {
  cy.visit("/");
  cy.loginUser().then(user => {
    cy.get("#site-logo").click();

    cy.findByText(/student debt/i).click();
    cy.findByText(/about the student debt collective/i);
  });
});
