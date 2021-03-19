import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "nav",
  elementId: "dc-sidebar",
  classNames: ["dc-sidebar d-flex flex-column"],
  activeCategoryId: null,

  categories: computed(function() {
    return this.site.get("categoriesList");
  }),

  @discourseComputed("currentURL")
  isLatestPage(currentURL) {
    return currentURL === "/latest" || currentURL === "/";
  },

  @discourseComputed("currentURL")
  isEventsPage(currentURL) {
    return currentURL === settings.events_url;
  },

  didInsertElement() {
    this._super(...arguments);
    this.appEvents.on("page:changed", this, "_setActiveCategoryId");
  },

  willDestroyElement() {
    this._super(...arguments);
    this.appEvents.off("page:changed", this, "_setActiveCategoryId");
  },

  _setActiveCategoryId() {
    // Ensure the router transition finished to get up-to-date url reference
    const { router } = Ember.getOwner(this).lookup("controller:application");

    // Avoid to set undefined while discovery route is just being loading
    if (router.currentRouteName === "discovery.loading") return;

    const category =
      router.currentRoute &&
      router.currentRoute.attributes &&
      router.currentRoute.attributes.category;
    const activeCategoryId = category && category.id;
    this.set("activeCategoryId", activeCategoryId);
  },

  actions: {
    handleClickLink(categoryId) {
      // Avoid delay to set active class using page:changed event
      this.set("activeCategoryId", categoryId);
    }
  }
});
