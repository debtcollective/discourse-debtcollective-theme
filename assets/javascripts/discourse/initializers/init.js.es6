import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debtcollective-init",
  initialize() {
    withPluginApi("0.8.9", api => {});
  }
};
