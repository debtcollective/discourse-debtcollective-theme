import { types } from "./field-types";

export const stateValidation = () => {
  // As the state is a dropdown there is no validation needed
  return true;
};

export const zipCodeValidation = value => {
  const format = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return format.test(value);
};

export const phoneValidation = value => {
  const format = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;
  return format.test(value);
};

// Define a map of custom validations
export const fieldTypesValidations = {
  [types.state]: value => stateValidation(value),
  [types.phone_number]: value => phoneValidation(value),
  [types.zip_code]: value => zipCodeValidation(value)
};

export const validateUserFieldsFormat = userFields => {
  let isValidData = true;

  if (!Ember.isEmpty(userFields)) {
    /*
      TODO: It will be great to extend the actual UserField model to include isValid property
      that can be set onChange and which we can be checked here, instead running all validations again.
    */
    isValidData = userFields.every(userField => {
      const { field, value } = userField;
      // If there is no validation func for a custom userField we assume identity function
      const validationFn =
        fieldTypesValidations[field.field_type] || (() => true);

      // If the field has a value we will check its format otherwise required empty fields will prevent submit by default
      return value ? validationFn && validationFn(value) : true;
    });
  }

  return isValidData;
};
