import discourseComputed from "discourse-common/utils/decorators";

import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-user-controller",
  initialize() {
    withPluginApi("0.8.24", api => {
      api.modifyClass("controller:user", {
        // This is to always display the user profile expanded
        @discourseComputed(
          "model.profile_hidden",
          "indexStream",
          "viewingSelf",
          "forceExpand"
        )
        collapsedInfo() {
          return false;
        },
      });
    });
  }
};
