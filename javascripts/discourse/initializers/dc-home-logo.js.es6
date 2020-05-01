import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-home-logo",
  initialize() {
    withPluginApi("0.8", api => {
      api.reopenWidget("home-logo", {
        settings: {
          href: settings.logo_href || Discourse.getURL("/")
        }
      });
    });
  }
};
