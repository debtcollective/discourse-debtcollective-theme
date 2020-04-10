import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";

export default Component.extend({
  tagName: "div",

  @discourseComputed("categories")
  collectives(categories) {
    const _categories = categories.content;
    return _categories.filter(c => c.is_collective);
  },

  @discourseComputed("categories")
  nonCollectives(categories) {
    const _categories = categories.content;
    return _categories.filter(c => !c.is_collective);
  },

  @discourseComputed("topics")
  currentEfforts(topics) {
    return topics.filter(topic => topic.pinned);
  }
});
