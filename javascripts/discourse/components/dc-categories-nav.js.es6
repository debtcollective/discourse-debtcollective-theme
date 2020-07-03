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
    return links.map(entry => {
      const [text, url] = entry.split(",").map(str => str.trim());
      const target = this._getAnchorTag(url);

      return { text, url, target };
    });
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
