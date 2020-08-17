import { buildUser } from "../support/generate";

const authHeaders = {
  "Api-Key": Cypress.env("DISCOURSE_API_KEY"),
  "Api-Username": Cypress.env("DISCOURSE_USERNAME"),
  "Content-Type": "application/json"
};

/**
 * Given a valid user id perform a request to activate it
 * typically to avoid the need of email verification
 */
const activateUser = userId => {
  return cy.request({
    url: `/admin/users/${userId}/activate`,
    method: "PUT",
    headers: authHeaders
  });
};

/**
 * Given a valid user object creates a new
 * entry for a user that then needs to be activated
 */
const createUser = user => {
  return cy.request({
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
  });
};

Cypress.Commands.add("createUser", overrides => {
  const user = buildUser(overrides);

  createUser(user).then(response => {
    activateUser.then(({ success }) => ({ ...user }));
  });
});

Cypress.Commands.add("loginUser", overrides => {
  const user = buildUser(overrides);

  // Needed in order to perform a login request
  const getCSRF = () => {
    return cy.request({
      url: `/session/csrf`,
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });
  };

  createUser(user).then(response => {
    activateUser(response.body.user_id).then(() => {
      // Ask for CSRF token
      getCSRF().then(response => {
        const csrfToken = response.body.csrf;

        cy.request({
          url: `/session`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-CSRF-Token": csrfToken
          },
          body: {
            login: user.email,
            password: user.password
          }
        }).then(() => {
          return user;
        });
      });
    });
  });
});

Cypress.Commands.add("assertHome", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertLoggedInAs", user => {
  cy.get(`img[title="${user.name}"]`).should("be.visible");
});
