import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

const GUEST_LINKS = [
  {
    href: "https://debtcollective.org/debt-union",
    text: "Join the Union",
    target: "_blank"
  }
];

const USER_LINKS = [
  {
    href: "https://debtcollective.org/hub",
    text: "Member hub",
    target: "_blank"
  }
];

const HEADER_LINKS = [
  {
    href: "https://biden100.debtcollective.org/",
    text: "Biden Jubilee 100",
    target: "_blank"
  },
  {
    href: "/",
    text: "Community",
    target: "_self"
  },
  {
    href: "https://teespring.com/stores/debt-collective",
    text: "Store",
    target: "_blank"
  }
];

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
        didInsertElement() {
          this._super();
        },
        afterRender() {
          this._super();
          this._updateSearchIcon();
          this._bindUserClass();
        }
      });

      api.reopenWidget("header-buttons", {
        html(attrs) {
          if (this.currentUser) {
            return;
          }

          const buttons = [];
          const loginLabel = this.site.isMobileDevice
            ? "dc.header.log_in_short"
            : "dc.header.log_in";

          buttons.push(
            this.attach("button", {
              label: themePrefix(loginLabel),
              className: "btn header-btn login-button",
              action: "showLogin"
            })
          );
          buttons.push(
            this.attach("link", {
              label: themePrefix("dc.header.donate"),
              className: "btn header-btn donate-button",
              href: "https://debtcollective.org/donate/"
            })
          );

          return buttons;
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
        const { user } = helper.attrs;
        const extraLinks = user ? USER_LINKS : GUEST_LINKS;
        const links = [...HEADER_LINKS, ...extraLinks];
        const linkNodes = links.map(link => {
          const { href, text, target } = link;
          return h("a.dc-header-link", { href, target }, text);
        });

        return helper.h(
          "nav#dc-header-links.dc-custom-headers-links.d-none.d-md-block",
          [
            linkNodes,
            h("dc-dropdown#dc-take-action-link", {
              label: "Take Action!",
              items: JSON.stringify([
                {
                  text: "Events",
                  href: "/calendar"
                },
                {
                  text: "Student Debt Strike",
                  href: "https://strike.debtcollective.org/",
                  target: "_blank"
                },
                {
                  text: "Dispute Your Debt",
                  href: "https://tools.debtcollective.org/",
                  target: "_blank"
                }
              ])
            })
          ]
        );
      });
    });
  }
};
