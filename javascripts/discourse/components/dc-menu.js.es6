import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";
import { action } from "@ember/object";

export default Component.extend({
  elementId: "dc-menu",

  @action
  closeMenu() {
    $("body").removeClass("dc-menu-open");
  }
});
