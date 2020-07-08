import Category from "discourse/models/category";
import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "div",
  classNames: ["dc-categories"],

  categories: computed(function() {
    const categoryIds = settings.header_categories.split("|");
    const categories = Category.findByIds(categoryIds);

    return categories;
  }),

  customLinks: computed(function() {
    const links = settings.header_categories_custom_links.split("|");

    const linkItems = links.map(entry => {
      // Invalidate emty entries
      if (!entry.trim()) return null;

      const parsedEntry = entry.split(",");
      // Invalidate entries that doesn't split into expected items to avoid unexpected output
      if (parsedEntry.length !== 2) return null;

      const [text, url] = parsedEntry.map(str => str.trim());

      // Invalidate empty text or empty url entries
      if (!text || !url) return null;

      const target = this._getAnchorTag(url);

      return { text, url, target };
    });

    // return only those items that were valid
    return linkItems.filter(Boolean);
  }),

  didInsertElement() {
    this._super(...arguments);
    this._bindEvents();
  },

  init() {
    this._super(...arguments);
  },

  _getAnchorTag(url) {
    const isInternalURL = url.match(window.location.host);

    // Avoid to set _self to allow ember route behave as expected
    return isInternalURL ? undefined : "_blank";
  },

  _bindEvents() {
    $(window).scroll(() => {
      if ($(window).scrollTop() > 0) {
        this.$(this.element).addClass("animated");
      } else {
        this.$(this.element).removeClass("animated");
      }
    });
  }
});
