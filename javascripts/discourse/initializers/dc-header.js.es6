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
        didInsertElement() {
          this._super();
          loadStencilScript(
            "https://unpkg.com/@debtcollective/dc-dropdown-component@1.6.3/dist/dropdown-component/dropdown-component.esm.js"
          );
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

          buttons.push(
            this.attach("button", {
              label: themePrefix("dc.header.log_in"),
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
        const values = [
          "Join the Union, https://debtcollective.org/debt-union/, _blank",
          "Community, https://community.debtcollective.org/, _self",
          "Store, https://teespring.com/stores/debt-collective, _blank"
        ];
        const links = values.map(entry => {
          const [text, href, target] = entry.split(",").map(str => str.trim());
          return h("a.dc-header-link", { href, target }, text);
        });

        return helper.h(
          "nav#dc-header-links.dc-custom-headers-links.d-none.d-md-block",
          [
            links,
            h("dc-dropdown#dc-take-action-link", {
              label: "Take Action!",
              items: JSON.stringify([
                {
                  text: "Events",
                  href: "https://community.debtcollective.org/calendar",
                  target: "_self"
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

function loadStencilScript(src) {
  var scriptModule = document.createElement("script");
  scriptModule.setAttribute("type", "module");
  scriptModule.setAttribute("src", src);
  document.head.appendChild(scriptModule);

  var scriptNoModule = document.createElement("script");
  scriptNoModule.setAttribute("nomodule", "");
  scriptNoModule.setAttribute("src", src);
  document.head.appendChild(scriptNoModule);
}
