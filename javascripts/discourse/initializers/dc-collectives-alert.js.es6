import { withPluginApi } from "discourse/lib/plugin-api";

function dcCollectivesAlert() {}

export default {
  name: "dc-collectives-alert",

  initialize() {
    withPluginApi("0.8.24", dcCollectivesAlert);
  }
};
