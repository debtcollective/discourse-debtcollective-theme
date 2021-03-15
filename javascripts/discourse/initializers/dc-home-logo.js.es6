import getURL from "discourse-common/lib/get-url";
import hbs from "discourse/widgets/hbs-compiler";
import { h } from "virtual-dom";
import { createWidget } from "discourse/widgets/widget";
import { withPluginApi } from "discourse/lib/plugin-api";

createWidget("dc-widget-logo", {
  buildKey: () => "dc-widget-logo-key",
  tagName: "div.dc-logo-widget",

  html(attrs, state) {
    const logoSmallUrl = this.siteSettings.site_logo_small_url || "";
    const title = this.siteSettings.title;

    if (logoSmallUrl.length) {
      return [
        h("img#site-logo.logo-small", {
          key: "logo-small",
          attributes: {
            src: getURL(logoSmallUrl),
            width: 36,
            alt: title
          }
        }),
        h("span.material-icons.mr-1", "keyboard_arrow_right")
      ];
    }

    return iconNode("home");
  },

  click() {
    $("body").addClass("dc-menu-open");
  }
});

export default {
  name: "dc-home-logo",
  initialize() {
    withPluginApi("0.8", api => {
      api.reopenWidget("home-logo", {
        settings: {
          href: settings.logo_href || getURL("/")
        },
        html() {
          // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/app/widgets/home-logo.js
          return h(
            "a",
            {
              attributes: {
                href: "https://debtcollective.org/",
                "data-auto-route": true,
                class: "built-in-logo"
              }
            },
            this.logo()
          );
        }
      });

      api.decorateWidget("home-logo:after", helper => {
        return helper.h("div", helper.attach("dc-widget-logo"));
      });
    });
  }
};
