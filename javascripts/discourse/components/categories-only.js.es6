import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";
import Topic from "discourse/models/topic";
import { ajax } from "discourse/lib/ajax";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "div",

  @discourseComputed("categories")
  topicCategories(categories) {
    return categories.filter(category => !category.tdc_is_collective);
  }
});
