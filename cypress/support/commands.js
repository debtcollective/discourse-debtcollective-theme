import { buildUser } from "../support/generate";

const authHeaders = {
  "Api-Key": Cypress.env("DISCOURSE_API_KEY"),
  "Api-Username": Cypress.env("DISCOURSE_USERNAME"),
  "Content-Type": "application/json"
};

Cypress.Commands.add("createUser", (overrides, userId) => {
  const user = buildUser(overrides);

  cy.request({
    url: `/users`,
    method: "POST",
    body: {
      name: user.name,
      email: user.email,
      password: user.password,
      username: user.username,
      // zipCode and phoneNumber are required custom fields
      user_fields: {
        "2": user.zipCode,
        "3": user.phoneNumber
      }
    },
    headers: authHeaders
  }).then(response => {
    cy.request({
      url: `/admin/users/${response.body.user_id}/activate`,
      method: "PUT",
      headers: authHeaders
    }).then(({ success }) => ({ ...user }));
  });
});

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertLoggedInAs", user => {
  cy.get(`img[title="${user.name}"]`).should("be.visible");
});
