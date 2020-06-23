import { withPluginApi } from "discourse/lib/plugin-api";
import { on, observes } from "ember-addons/ember-computed-decorators";

import { states as usaStates } from "../lib/data/usa";
import { fieldTypesValidations } from "../lib/validations";
import {
  types,
  getBuiltInFieldTypes,
  PhoneFieldType,
  StateFieldType,
  ZipCodeFieldType
} from "../lib/field-types";

const initializeCustomFieldTypes = api => {
  api.modifyClassStatic("model:user-field", {
    fieldTypes() {
      return getBuiltInFieldTypes().concat(
        PhoneFieldType,
        StateFieldType,
        ZipCodeFieldType
      );
    }
  });

  api.modifyClass("component:user-field", {
    classNameBindings: ["isValidFormat::error"],
    isValidFormat: true,

    @on("init")
    enhanceFieldComponentValidation() {
      // If there is no validation func for a custom userField we assume identity function
      this._enhancedValidationFn =
        fieldTypesValidations[this.field.field_type] || (() => true);
    },

    @on("init")
    bindFixedOptions() {
      // Prevent to break built-in dropdowns by checking already defined options
      let options = this.field.options;

      if (!options) {
        switch (this.field.field_type) {
          case types.state:
            options = usaStates;
            break;
          default:
            break;
        }
      }

      Ember.set(this.field, "options", options);
    },

    @observes("value")
    validateValue() {
      this._enhancedValidationFn &&
        Ember.run.debounce(
          this,
          value => {
            let isValid = true;

            // If there is no value at all we will keep the UI idle
            if (value) {
              isValid = this._enhancedValidationFn(value);
            }

            this.set("isValidFormat", isValid);
          },
          this.get("value"),
          250
        );
    }
  });
};

export default {
  name: "discourse-debtcollective-signup-fields",
  before: "inject-discourse-objects",
  initialize() {
    withPluginApi("0.8.24", initializeCustomFieldTypes);
  }
};
