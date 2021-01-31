import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "nav",
  elementId: "dc-sidebar",
  classNames: ["dc-sidebar d-flex flex-column w-100"],

  categories: computed(function() {
    return this.site.get("categoriesList");
  })
});
