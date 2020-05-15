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
  },

  didInsertElement() {
    this._ensureVisibleElements();
    this._hideLoadingMessage();
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
    const { pathname: currentPage } = window.location;
    const visibleElementsClass = ".show-more-visible-true";
    const blacklistedPages = ["/latest"];
    const hasVisibleElements =
      this.element.querySelectorAll(visibleElementsClass).length > 0;

    if (hasVisibleElements && !blacklistedPages.includes(currentPage)) return;

    this.toggleExpanded();
  }
});
