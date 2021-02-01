import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "ul",
  classNames: ["ml-4 list-unstyled list-nested"],
  classNameBindings: ["isExpanded:expanded"],

  isExpanded: false,

  category: null,
  currentCategoryId: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this._computeAttrs();
  },

  _computeAttrs() {
    // Avoid to do any comparation unless there is value
    if (!this.currentCategoryId) return;

    this.set(
      "isExpanded",
      this.category.id === this.currentCategoryId || this._expandBySubcategory()
    );
  },

  _expandBySubcategory() {
    return this.category.isParent
      ? this.category.subcategories.find(c => c.id === this.currentCategoryId)
      : false;
  }
});
