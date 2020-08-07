import { buildUser } from "../support/generate";

describe("registration", () => {
  it("allows the creation of new users", () => {
    const user = buildUser();

    cy.visit("/");

    cy.findByText(/sign up/i).click();

    // Fill up signup form
    cy.findByLabelText(/email/i).type(user.email);
    cy.findByLabelText(/username/i).type(user.username);
    cy.findByLabelText(/^name$/i).type(user.name);
    cy.findByLabelText(/password/i).type(user.password);
    cy.findByLabelText(/zip code/i).type(user.zipCode);
    cy.findByLabelText(/phone number/i).type(user.phoneNumber);
    cy.findByRole("button", { name: /create.*account/i }).click();

    // Verify the account has been created and sent activation email;
    cy.findByText(/sent.*activation mail/i).should("be.visible");
  });
});
