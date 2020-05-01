import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";

export default Component.extend({
  tagName: "div",

  @discourseComputed("categories")
  collectives(categories) {
    return categories.filter(category => category.tdc_is_collective);
  },

  @discourseComputed("categories")
  nonCollectives(categories) {
    return categories.filter(category => !category.tdc_is_collective);
  },

  @discourseComputed("topics")
  currentEfforts(topics) {
    return (topics && topics.filter(topic => topic.pinned)) || [];
  }
});
