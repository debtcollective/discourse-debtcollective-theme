import discourseComputed from "discourse-common/utils/decorators";
import { computed } from "@ember/object";
import Component from "@ember/component";

export default Component.extend({
  tagName: "div",
  classNames: ["dc-topic-card-content", "h-100"],
  classNameBindings: ["isUnread:is-unread:already-seen"],

  topicAuthor: computed(function() {
    return this.topic.posters[0].user;
  }),
  lastRepliedAuthor: computed(function() {
    return this.topic.lastPoster.user;
  }),
  isUnreplied: computed(function() {
    return this.topic.replyCount === 0;
  }),

  didInsertElement() {
    this._bindClasses();
  },

  _bindClasses() {
    const isUnread = this.topic.totalUnread > 0 || this.topic.unseen;
    this.set("isUnread", isUnread);
  }
});
