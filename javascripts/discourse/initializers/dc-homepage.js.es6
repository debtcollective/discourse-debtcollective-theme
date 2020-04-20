import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-homepage",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("route:discovery-categories", {
        findCategories() {
          return this._findCategoriesAndTopics("latest");
        }
      });
    });
  }
};
