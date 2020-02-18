import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-post",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:scrolling-post-stream", {
        didInsertElement() {
          this._super(...arguments);

          const $topicTitle = $("#topic-title");
          const $topicTitleDestination = $(".embed-topic-title");

          $(window).on("load", function() {
            $topicTitle.appendTo(".embed-topic-title");
          });
        }
      });

      api.reopenWidget("post-article", {
        buildClasses(attrs) {
          const classes = this._super(attrs);
          classes.push("dc-topic-post");

          if (attrs.firstPost) {
            classes.push("is-first-post");
          }

          return classes;
        }
      });

      api.reopenWidget("post-meta-data", {
        html(attrs) {
          let html = this._super(attrs);

          if (attrs.firstPost) {
            html.unshift(this.attach("dc-topic-title", attrs));
          }

          return html;
        }
      });
    });
  }
};
