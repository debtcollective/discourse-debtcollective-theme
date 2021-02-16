import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "span",
  classNames: ["sidebar-link"],

  actions: {
    handlOnClick(categoryId) {
      this.onClick(categoryId);
    }
  }
});
