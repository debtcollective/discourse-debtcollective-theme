import { withPluginApi } from "discourse/lib/plugin-api";
import PostCooked from "discourse/widgets/post-cooked";
import DecoratorHelper from "discourse/widgets/decorator-helper";
import { h } from "virtual-dom";

export default {
  name: "debtcollective-topic",
  initialize() {
    withPluginApi("0.8.9", api => {
      api.reopenWidget("embedded-post", {
        html(attrs, state) {
          // Change post-avatar size for this render
          api.changeWidgetSetting("post-avatar", "size", "medium");

          const body = [
            h("div.reply", { attributes: { "data-post-id": attrs.id } }, [
              h("div.topic-header", [
                this.attach("post-avatar", attrs),
                h("div.topic-meta-data", [
                  this.attach("poster-name", attrs),
                  this.attach("post-link-arrow", {
                    above: state.above,
                    shareUrl: attrs.shareUrl
                  })
                ])
              ]),
              h("div.row", [
                h("div.topic-body", [
                  new PostCooked(attrs, new DecoratorHelper(this))
                ])
              ])
            ])
          ];

          api.changeWidgetSetting("post-avatar", "size", "large");

          return body;
        }
      });
    });
  }
};
