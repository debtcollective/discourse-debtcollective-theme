import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  groupCount: computed(function() {
    const category = this.category;

    if (!category.is_collective) return null;

    return category.collective_group.user_count;
  })
});
