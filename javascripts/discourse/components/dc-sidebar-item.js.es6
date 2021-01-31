import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "li",
  classNames: ["list-item"],
  classNameBindings: ["isActive:active"],

  category: null,
  currentCategoryId: null,

  isActive: false,

  didReceiveAttrs() {
    this._super(...arguments);
    this._computeAttrs();
  },

  _computeAttrs() {
    const category = this.getWithDefault("category", {});
    this.set("isActive", category.id === this.get("currentCategoryId"));
  }
});
