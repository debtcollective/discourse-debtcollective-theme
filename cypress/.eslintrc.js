module.exports = {
  root: true,
  plugins: ["eslint-plugin-cypress"],
  extends: ["plugin:cypress/recommended", "plugin:prettier/recommended"],
  env: { "cypress/globals": true }
};
