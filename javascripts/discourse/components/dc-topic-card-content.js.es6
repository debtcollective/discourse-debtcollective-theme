import discourseComputed from "discourse-common/utils/decorators";
import Component from "@ember/component";

export default Component.extend({
  tagName: "div",
  classNames: ["dc-topic-card-content", "h-100"],
  classNameBindings: ["isUnread:is-unread:already-seen"],

  didInsertElement() {
    this._bindClasses();
  },

  _bindClasses() {
    const isUnread = this.topic.totalUnread > 0 || this.topic.unseen;
    this.set("isUnread", isUnread);
  }
});
