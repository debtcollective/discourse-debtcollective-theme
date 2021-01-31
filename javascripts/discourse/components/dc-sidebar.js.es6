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

  didInsertElement() {
    this._super(...arguments);
    this.appEvents.on("page:changed", this, "_setInitialActiveCategoryId");
  },

  willDestroyElement() {
    this._super(...arguments);
    this.appEvents.off("page:changed", this, "_setInitialActiveCategoryId");
  },

  _setInitialActiveCategoryId() {
    // Ensure the router transition finished to get up-to-date url reference
    const { router } = Ember.getOwner(this).lookup("controller:application");
    const category =
      router.currentRoute &&
      router.currentRoute.attributes &&
      router.currentRoute.attributes.category;
    this.set("activeCategoryId", category && category.id);
  },

  actions: {
    setActiveCategoryId(categoryId) {
      this.set("activeCategoryId", categoryId);
    }
  }
});
