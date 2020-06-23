import { i18n } from "discourse/lib/computed";

// Get the displayable name of each field from locales
const UserFieldType = Ember.Object.extend({
  name: i18n("id", "admin.user_fields.field_types.%@")
});

// Avoid hard-coded strings for convenience in custom field ids (Values should match templates names)
export const types = {
  state: "state",
  zip_code: "zip-code",
  phone_number: "phone-number"
};

// Get the already built in types from Discourse
export const getBuiltInFieldTypes = () => {
  /*
    UserField.fieldTypes();

    Idle this implementation should be get from https://bit.ly/2GODatU but as an admin module
    requiring the "admin/models/user-field" will throw an error in the application when a guest user or
    not admin user try to access the app.

    TODO: Find a way to get the built-in UserFieldTypes from the discourse core implementation that doesn't
    break regardless the role of the user (guest, registered user, admin user).
  */
  return [
    UserFieldType.create({ id: "text" }),
    UserFieldType.create({ id: "confirm" }),
    UserFieldType.create({ id: "dropdown", hasOptions: true })
  ];
};

// Define custom types to be injected
export const PhoneFieldType = UserFieldType.create({ id: types.phone_number });
export const StateFieldType = UserFieldType.create({ id: types.state });
export const ZipCodeFieldType = UserFieldType.create({ id: types.zip_code });
