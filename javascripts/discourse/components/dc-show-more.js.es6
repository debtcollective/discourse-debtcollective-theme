import Component from "@ember/component";
import { action } from "@ember/object";

export default Component.extend({
  tagName: "section",
  classNames: ["show-more-section"],
  classNameBindings: ["isExpanded:expanded:collapsed"],
  isExpanded: false,
  displayText: "",

  init() {
    this._super(...arguments);
    this._updateDisplayText();
  },

  willUpdate() {
    this._updateDisplayText();
  },

  @action
  toggleExpanded() {
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
