import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-quick-access-menu",
  initialize() {
    withPluginApi("0.8", api => {
      api.reopenWidget("quick-access-item", {
        html(attrs) {
          // Allow to inject nodes within the quick-access-profile items
          if (attrs.custom) {
            return attrs.custom;
          }

          const html = this._super(attrs);
          return html;
        }
      });

      api.reopenWidget("quick-access-profile", {
        _lookupCount(type) {
          const tts = this.register.lookup("topic-tracking-state:main");
          return tts ? tts.lookupCount(type) : 0;
        },

        // The code in regards links below has been imported from Discourse hamburger-menu widget code
        // https://github.com/discourse/discourse/blob/79b8c08d45da40248484b6ea564f604b9d58e919/app/assets/javascripts/discourse/widgets/hamburger-menu.js.es6#L85
        _customLinks() {
          const links = [];
          const { currentUser, siteSettings } = this;
          const { reviewable_default_topics } = siteSettings;

          links.push(
            this.attach("link", {
              route: "discovery.latest",
              className: "latest-topics-link",
              label: "filters.latest.title",
              title: "filters.latest.help",
              omitSpan: true
            })
          );

          if (currentUser) {
            links.push(
              this.attach("link", {
                route: "discovery.new",
                className: "new-topics-link",
                labelCount: "filters.new.title_with_count",
                label: "filters.new.title",
                title: "filters.new.help",
                count: this._lookupCount("new"),
                omitSpan: true
              })
            );

            links.push(
              this.attach("link", {
                route: "discovery.unread",
                className: "unread-topics-link",
                labelCount: "filters.unread.title_with_count",
                label: "filters.unread.title",
                title: "filters.unread.help",
                count: this._lookupCount("unread"),
                omitSpan: true
              })
            );
          }

          if (currentUser.staff || currentUser.reviewable_count) {
            // Staff always see the review link. Non-staff will see it if there are items to review
            links.push(
              this.attach("link", {
                route: reviewable_default_topics ? "review.topics" : "review",
                className: "review",
                label: "review.title",
                badgeCount: "reviewable_count",
                badgeClass: "reviewables",
                omitSpan: true
              })
            );
          }

          return links;
        },

        _getDefaultItems() {
          const items = this._super();
          const customLinks = this._customLinks();
          const customSection = {
            className: "embedded-menu-item",
            custom: h("div.embedded-menu", customLinks)
          };

          return items.concat(customSection);
        }
      });
    });
  }
};
