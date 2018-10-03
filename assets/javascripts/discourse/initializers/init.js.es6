import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debtcollective-init",
  initialize() {
    withPluginApi("0.8.9", api => {
      /*
       * Render headers links
       * Taken from https://github.com/hnb-ku/discourse-custom-header-links/blob/master/common/header.html
       */ 
      api.decorateWidget("home-logo:after", helper => {
        const titleVisible = helper.attrs.minimized;
        if (titleVisible) {
          $(".header-link:not(.keep)").hide();
        } else {
          $(".header-link").show();
        }
      });
      
      const headerLinks = (headerLinksConfig) => {
        /*
         * List settings in Discourse are strings separated by '|'
         * Header links follow this pattern
         * label, title, href, className, target, keep
         * 
         * keep is used to preserve the link when scrolling inside a topic
         */
        return headerLinksConfig.split('|').map((headerItem) => {
          const headerConfig = headerItem.split(',').map((value) => value.trim());
          const [label, title, href, className, target, keep] = headerConfig;
      
          return {
            label,
            title,
            href,
            className,
            target: target === "self" ? "" : "_blank",
            keep: keep !== "keep" ? "" : "keep",
          };
        })
      }

      const links = headerLinks(Discourse.SiteSettings.debtcollective_header_links);

      // Add links to the header
      links.forEach((link) => {
        api.decorateWidget("header-buttons:before", helper => {
          return helper.h(
            `li.header-link.${link.className}.${link.keep}`,
            helper.h(
              "a",
              {
                href: link.href,
                title: link.title,
                target: link.target
              },
              link.label
            )
          );
        });
      });

      // Add links to the hamburger-menu
      api.decorateWidget("hamburger-menu:footerLinks", () => {
        return links.map(link => ({ href: link.href, rawLabel: link.label, className: "debtcollective-link" }));
      }); 
    });
  }
};