import { withPluginApi } from "discourse/lib/plugin-api";
import { transformBasicPost } from "discourse/lib/transform-post";
import { postTransformCallbacks } from "discourse/widgets/post-stream";
import { h } from "virtual-dom";

function transformWithCallbacks(post) {
  let transformed = transformBasicPost(post);
  postTransformCallbacks(transformed);
  return transformed;
}

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

          return h("div.dc-topic-avatar.user-image", html);
        }
      });

      api.reopenWidget("post-body", {
        tagName: "div.dc-col",
        html(attrs) {
          attrs.showTopicMap = false;
          const html = this._super(attrs);

          return h("div.dc-topic-body", html);
        }
      });

      api.reopenWidget("embedded-post", {
        tagName: "div.dc-embedded-post"
      });

      api.reopenWidget("post-article", {
        defaultState() {
          const state = this._super();
          return Object.assign(state, {
            expandedFirstPost: false,
            repliesBelow: []
          });
        },
        buildClasses(attrs) {
          const classes = this._super(attrs);
          classes.push("dc-topic-post");

          if (attrs.firstPost) {
            classes.push("is-first-post");
          }

          if (!this.state.repliesShown) {
            classes.push("contents");
          }

          return classes;
        },
        html(attrs, state) {
          let html = this._super(attrs, state);
          const extraState = {
            state: { repliesShown: !!state.repliesBelow.length }
          };

          const postMenu = this.attach("post-menu", attrs, extraState);

          html.push(h("div.row.post-menu-row", h("div.dc-col", postMenu)));

          if (state.repliesAbove.length) {
            const replies = state.repliesAbove.map(p => {
              return this.attach("embedded-post", p, {
                model: this.store.createRecord("post", p),
                state: { above: true }
              });
            });

            const embeddedPosts = h("section.embedded-posts.top.dc-component", [
              this.attach("button", {
                title: "post.collapse",
                icon: "chevron-down",
                action: "toggleReplyAbove",
                actionParam: "true",
                className: "btn collapse-down"
              }),
              replies
            ]);

            html.unshift(
              h(
                "div.embedded-posts-container.above-post-correction",
                h("div.row", h("div.dc-col", embeddedPosts))
              )
            );
          }

          if (state.repliesBelow.length) {
            const replies = state.repliesBelow.map(p => {
              return this.attach("embedded-post", p, {
                model: this.store.createRecord("post", p)
              });
            });

            const embeddedPosts = h("section.embedded-posts.bottom", [
              replies,
              this.attach("button", {
                title: "post.collapse",
                icon: "chevron-up",
                action: "toggleRepliesBelow",
                actionParam: "true",
                className: "btn collapse-up"
              })
            ]);

            html.push(
              h(
                "div.embedded-posts-container",
                h("div.row", h("div.dc-col", embeddedPosts))
              )
            );
          }

          return html;
        },
        toggleRepliesBelow(goToPost = "false") {
          if (this.state.repliesBelow.length) {
            this.state.repliesBelow = [];
            if (goToPost === "true") {
              DiscourseURL.routeTo(
                `${this.attrs.topicUrl}/${this.attrs.post_number}`
              );
            }
            return;
          }

          const post = this.findAncestorModel();
          const topicUrl = post ? post.get("topic.url") : null;
          return this.store
            .find("post-reply", { postId: this.attrs.id })
            .then(posts => {
              this.state.repliesBelow = posts.map(p => {
                p.shareUrl = `${topicUrl}/${p.post_number}`;
                return transformWithCallbacks(p);
              });
            });
        }
      });

      api.reopenWidget("post-contents", {
        html(attrs, state) {
          let html = this._super(attrs, state);
          const postMenuIndex = html.findIndex(widget => {
            if (!widget) return;
            widget.key && widget.key.includes("post-menu");
          });
          const postMenu = html.splice(postMenuIndex, 1);

          return html;
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
