import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-topic-timeline",
  initialize() {
    withPluginApi("0.8", api => {
      api.reopenWidget("topic-timeline", {
        html(attrs, state) {
          let html = this._super(attrs, state);

          const virtualNodes = html.filter(item =>
            item.hasOwnProperty("properties")
          );
          const widgets = html.filter(
            item => !item.hasOwnProperty("properties")
          );

          return [h("div.dc-topic-timeline-controls", widgets), virtualNodes];
        }
      });
    });
  }
};
