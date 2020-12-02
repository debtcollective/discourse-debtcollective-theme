import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";
import Topic from "discourse/models/topic";
import { ajax } from "discourse/lib/ajax";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "div",
  currentEfforts: [],

  @discourseComputed("categories")
  nonCollectives(categories) {
    return categories.filter(category => !category.tdc_is_collective);
  },

  didInsertElement() {
    this._fetchCurrentEfforts();
  },

  _fetchCurrentEfforts() {
    ajax("/tags/current-efforts.json").then(results => {
      const currentEfforts = [];
      const topics = results.topic_list.topics || [];
      const users = results.users;

      topics.forEach(function(topic) {
        topic.posters.forEach(function(poster) {
          poster.user = $.grep(users, function(user) {
            return user.id == poster.user_id;
          })[0];
        });

        currentEfforts.push(Topic.create(topic));
      });

      this.set("currentEfforts", currentEfforts);
    });
  }
});
