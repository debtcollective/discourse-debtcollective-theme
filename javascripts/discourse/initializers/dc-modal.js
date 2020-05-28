import { withPluginApi } from "discourse/lib/plugin-api";
import computed from "discourse-common/utils/decorators";

export default {
  name: "dc-modal",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:d-modal", {
        @computed("dismissable", "showCloseButton")
        shouldShowCloseButton(dismissable, showCloseButton) {
          return showCloseButton || dismissable;
        },

        _modalBodyShown(data) {
          if (this.isDestroying || this.isDestroyed) {
            return;
          }

          if (data.fixed) {
            this.element.classList.remove("hidden");
          }

          if (data.title) {
            this.set("title", I18n.t(data.title));
          } else if (data.rawTitle) {
            this.set("title", data.rawTitle);
          }

          if (data.subtitle) {
            this.set("subtitle", I18n.t(data.subtitle));
          } else if (data.rawSubtitle) {
            this.set("subtitle", data.rawSubtitle);
          } else {
            // if no subtitle provided, makes sure the previous subtitle
            // of another modal is not used
            this.set("subtitle", null);
          }

          if ("dismissable" in data) {
            this.set("dismissable", data.dismissable);
          } else {
            this.set("dismissable", true);
          }

          if ("showCloseButton" in data) {
            this.set("showCloseButton", data.showCloseButton);
          } else {
            this.set("showCloseButton", false);
          }
        }
      });
    });
  }
};
