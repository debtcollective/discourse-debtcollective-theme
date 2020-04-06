import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "dc-header",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:site-header", {
        _bindUserClass() {
          if (this.currentUser) {
            $(".d-header").addClass("with-user");
          }
        },
        _updateSearchIcon() {
          const searchButton = this.element.querySelector("#search-button");

          if ($(searchButton).hasClass("material-icons")) return;

          $(searchButton)
            .addClass("material-icons")
            .html("search");
        },
        afterRender() {
          this._super();
          this._updateSearchIcon();
          this._bindUserClass();
        }
      });

      api.reopenWidget("user-menu", {
        defaultState() {
          const state = this._super();
          return Object.assign({}, state, {
            currentQuickAccess: "profile"
          });
        }
      });

      api.reopenWidget("quick-access-item", {
        html(attrs) {
          // Allow to inject nodes within the quick-access-profile items
          if (attrs.customItem) {
            return attrs.customItem;
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

        _customLinks() {
          const links = [];
          const { currentUser, siteSettings } = this;
          const { reviewable_default_topics } = siteSettings;

          links.push({
            customItem: this.attach("link", {
              route: "discovery.latest",
              className: "latest-topics-link",
              label: "filters.latest.title",
              title: "filters.latest.help",
              omitSpan: true
            })
          });

          if (currentUser) {
            links.push({
              customItem: this.attach("link", {
                route: "discovery.new",
                className: "new-topics-link",
                labelCount: "filters.new.title_with_count",
                label: "filters.new.title",
                title: "filters.new.help",
                count: this._lookupCount("new"),
                omitSpan: true
              })
            });

            links.push({
              customItem: this.attach("link", {
                route: "discovery.unread",
                className: "unread-topics-link",
                labelCount: "filters.unread.title_with_count",
                label: "filters.unread.title",
                title: "filters.unread.help",
                count: this._lookupCount("unread"),
                omitSpan: true
              })
            });
          }

          if (currentUser.staff || currentUser.reviewable_count) {
            // Staff always see the review link. Non-staff will see it if there are items to review
            links.push({
              customItem: this.attach("link", {
                route: reviewable_default_topics ? "review.topics" : "review",
                className: "review",
                label: "review.title",
                badgeCount: "reviewable_count",
                badgeClass: "reviewables",
                omitSpan: true
              })
            });
          }

          return links;
        },

        _getDefaultItems() {
          const items = this._super();
          const customItems = this._customLinks();

          return items.concat(customItems);
        }
      });

      api.reopenWidget("header-notifications", {
        html(attrs, state) {
          const html = this._super(attrs, state);
          const profileImage = html.find(widget => {
            if (!widget) return;

            return widget.tagName === "IMG";
          });

          return profileImage;
        }
      });

      api.reopenWidget("header-icons", {
        html(attrs, state) {
          const html = this._super(attrs, state);

          const menuWidgetIndex = html.findIndex(widget => {
            if (!widget) return;

            return (
              widget.attrs &&
              widget.attrs.title &&
              widget.attrs.title.includes("hamburger_menu")
            );
          });

          // remove the hamburguer menu
          html.splice(menuWidgetIndex, 1);

          // add notifications icon with count
          const { user } = attrs;

          if (!user) return html;

          const unreadNotifications = user.get("unread_notifications");

          html.push(
            h(
              "li.header-dropdown-toggle#notifications",
              h("a", { href: `${user.path}/notifications` }, [
                h("div.icon.btn-flat.material-icons", "notifications"),
                unreadNotifications
                  ? h(
                      "span.badge-notification.unread-notifications",
                      {
                        title: I18n.t(
                          themePrefix("notifications.tooltip.regular"),
                          { count: unreadNotifications }
                        )
                      },
                      unreadNotifications
                    )
                  : null
              ])
            )
          );

          // add messages icon with count
          const unreadPMs = user.get("unread_private_messages");

          html.push(
            h(
              "li.header-dropdown-toggle#inbox",
              h("a", { href: `${user.path}/messages` }, [
                h("div.icon.btn-flat.material-icons", "email"),
                unreadPMs
                  ? h(
                      "span.badge-notification.unread-private-messages",
                      {
                        title: I18n.t(
                          themePrefix("notifications.tooltip.message"),
                          { count: unreadPMs }
                        )
                      },
                      unreadPMs
                    )
                  : null
              ])
            )
          );

          return html;
        }
      });
    });
  }
};
