import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-post",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:scrolling-post-stream", {
        buildArgs() {
          // Add topicData as extra property to pass down
          return this.getProperties(
            "topicData",
            "posts",
            "canCreatePost",
            "multiSelect",
            "gaps",
            "selectedQuery",
            "selectedPostsCount",
            "searchService",
            "showReadIndicator"
          );
        }
      });

      api.reopenWidget("post", {
        /**
         * rewrite implementation of https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/widgets/post.js.es6#L683
         * to allow pass topic data within the attributes to child post widget and render title within metadata
         */
        html(attrs) {
          if (attrs.cloaked) return "";

          return this.attach(
            "post-article",
            Object.assign({}, attrs, {
              topicData: this.parentWidget.attrs.topicData
            })
          );
        }
      });

      api.reopenWidget("post-avatar", {
        tagName: "div.dc-col-1.d-none.d-lg-block",
        settings: {
          size: "extra_large",
          displayPosterName: false
        },
        html(attrs) {
          const html = this._super(attrs);

          return h("div.dc-topic-avatar", html);
        }
      });

      api.reopenWidget("post-body", {
        tagName: "div.dc-col",
        html(attrs) {
          const html = this._super(attrs);

          return h("div.dc-topic-body", html);
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
            html.unshift(this.attach("dc-topic-title", attrs.topicData));
          }

          return html;
        }
      });
    });
  }
};
