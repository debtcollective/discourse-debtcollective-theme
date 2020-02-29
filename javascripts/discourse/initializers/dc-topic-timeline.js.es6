import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-topic-timeline",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:topic-timeline", {
        addShowClass: true
      });

      api.reopenWidget("topic-timeline", {
        html(attrs, state) {
          let html = this._super(attrs, state);

          // Avoid any further customisation that can affect "topic-progress" widget
          // The 1200 is tight to the CSS rule for topic-timeline where we decide to show only >= 1200px
          if (window.innerWidth < 1200) return html;

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
