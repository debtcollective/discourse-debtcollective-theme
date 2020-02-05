import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-topic-list",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:topic-list", {
        tagName: "div"
      });

      api.modifyClass("component:topic-list-item", {
        tagName: "div"
      });
    });
  }
};
