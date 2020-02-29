import Component from "@ember/component";
import { action } from "@ember/object";

export default Component.extend({
  tagName: "section",
  classNames: ["show-more-section"],
  classNameBindings: ["isExpanded:expanded:collapsed"],
  isExpanded: false,
  collapsable: false,
  displayButton: true,
  displayText: "",

  init() {
    this._super(...arguments);
    this._updateDisplayText();
  },

  didInsertElement() {
    const visibleElementsClass = ".show-more-visible-true";
    const hasVisibleElements =
      this.element.querySelectorAll(visibleElementsClass).length > 0;

    if (hasVisibleElements) return;

    this.toggleExpanded();
  },

  willUpdate() {
    this._updateDisplayText();
  },

  @action
  toggleExpanded() {
    this.set("displayButton", this.collapsable);
    this.set("isExpanded", !this.isExpanded);
  },

  _updateDisplayText() {
    this.set(
      "displayText",
      this.isExpanded
        ? I18n.t(themePrefix("dc.show_more.expanded"))
        : I18n.t(themePrefix("dc.show_more.collapsed"))
    );
  }
});
