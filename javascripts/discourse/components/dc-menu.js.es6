import getURL from "discourse-common/lib/get-url";
import discourseComputed from "discourse-common/utils/decorators";
import DiscourseURL from "discourse/lib/url";
import Component from "@ember/component";
import { action, computed } from "@ember/object";

export default Component.extend({
  elementId: "dc-menu",
  classNames: ["dc-menu-container"],

  homepageURL: computed(function() {
    return settings.logo_href || getURL("/");
  }),

  @action
  closeMenu() {
    $("body").removeClass("dc-menu-open");
  }
});
