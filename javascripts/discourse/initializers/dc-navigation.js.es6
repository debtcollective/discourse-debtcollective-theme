import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";

export default {
  name: "dc-navigation",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:d-navigation", {
        @discourseComputed("filterMode")
        isLatestPage(filterMode) {
          return filterMode === "latest";
        }
      });
    });
  }
};
