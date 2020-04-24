import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  groupCount: computed(function() {
    const category = this.category;
    const isCollective = category.tdc_is_collective;

    if (!isCollective) return null;

    return category.tdc_collective_group.user_count;
  })
});
