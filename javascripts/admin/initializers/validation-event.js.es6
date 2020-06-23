import { withPluginApi } from "discourse/lib/plugin-api";

import { validateUserFieldsFormat } from "../lib/validations";

const initializeValidationEvent = api => {
  api.modifyClass("controller:preferences/profile", {
    actions: {
      save() {
        const isValidData = validateUserFieldsFormat(this.get("userFields"));

        if (isValidData) {
          this._super();
        }
      }
    }
  });

  api.modifyClass("controller:create-account", {
    actions: {
      createAccount() {
        const isValidData = validateUserFieldsFormat(this.get("userFields"));

        if (isValidData) {
          this._super();
        }
      }
    }
  });
};

export default {
  name: "validation-hook",
  initialize() {
    withPluginApi("0.8.24", initializeValidationEvent);
  }
};
