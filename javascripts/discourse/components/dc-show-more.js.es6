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
    this._ensureVisibleElements();
    this._hideLoadingMessage();
  },

  willUpdate() {
    this._updateDisplayText();
  },

  @action
  toggleExpanded() {
    this.set("displayButton", this.collapsable);
    this.set("isExpanded", !this.isExpanded);

    this._hideLoadingMessage();
  },

  /**
   * avoid to show the message of "no more topics" if not expanded yet
   * prevent to show the loading spinner until component gets expanded
   */
  _hideLoadingMessage() {
    const loadingContainerSelectors = [".topic-list-bottom"];

    $(loadingContainerSelectors.join(",")).css(
      "display",
      this.isExpanded ? "block" : "none"
    );
  },

  _ensureVisibleElements() {
    const visibleElementsClass = ".show-more-visible-true";
    const hasVisibleElements =
      this.element.querySelectorAll(visibleElementsClass).length > 0;

    if (hasVisibleElements) return;

    this.toggleExpanded();
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
