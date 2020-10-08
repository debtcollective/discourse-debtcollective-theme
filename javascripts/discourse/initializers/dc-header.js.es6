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
          const unreadPriority = user.get("unread_high_priority_notifications");

          html.push(
            h(
              "li.header-dropdown-toggle#inbox",
              h("a", { href: `${user.path}/messages` }, [
                h("div.icon.btn-flat.material-icons", "email"),
                unreadPriority
                  ? h(
                      "span.badge-notification.unread-private-messages",
                      {
                        title: I18n.t(
                          themePrefix("notifications.tooltip.high_priority"),
                          { count: unreadPriority }
                        )
                      },
                      unreadPriority
                    )
                  : null
              ])
            )
          );

          return html;
        }
      });

      api.decorateWidget("header-icons:before", helper => {
        const values = [
          "Join the Union, https://debtcollective.org/debt-union/, _blank",
          "Community, https://community.debtcollective.org/, _self",
          "Store, https://teespring.com/stores/debt-collective, _blank",
          "Events, https://community.debtcollective.org/calendar, _blank",
          "Student Debt Strike, https://strike.debtcollective.org/, _blank",
          "Dispute your debt, https://tools.debtcollective.org/, _blank"
        ];
        const links = values.map(entry => {
          const [text, href, target] = entry.split(",").map(str => str.trim());
          return h("a.dc-header-link", { href, target }, text);
        });

        return helper.h("nav.dc-custom-headers-links.d-none.d-md-block", links);
      });
    });
  }
};
