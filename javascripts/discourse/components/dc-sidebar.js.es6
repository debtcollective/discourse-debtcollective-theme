import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "nav",
  elementId: "dc-sidebar",
  classNames: ["dc-sidebar d-flex flex-column w-100"],
  activeCategoryId: null,

  categories: computed(function() {
    return this.site.get("categoriesList");
  }),

  init() {
    this._super(...arguments);
    const { router } = Ember.getOwner(this).lookup("controller:application");
    const { category } = router.currentRoute
      ? router.currentRoute.attributes
      : { category: null };
    this.set("activeCategoryId", category && category.id);
  },

  actions: {
    setActiveCategoryId(categoryId) {
      this.set("activeCategoryId", categoryId);
    }
  }
});
