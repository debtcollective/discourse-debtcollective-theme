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
    this.set(
      "isExpanded",
      // Active category match this element category
      this.category.id === this.currentCategoryId ||
        // A subcategory of this parent has been clicked
        this._expandBySubcategory()
    );
  },

  _expandBySubcategory() {
    return this.category.isParent
      ? Boolean(
          this.category.subcategories.find(c => c.id === this.currentCategoryId)
        )
      : false;
  }
});
