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

  didInsertElement() {
    this._super(...arguments);
    this._bindEvents();
  },

  init() {
    this._super(...arguments);
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
