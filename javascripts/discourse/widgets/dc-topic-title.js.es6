import { createWidget } from "discourse/widgets/widget";
import { replaceEmoji } from "discourse/widgets/emoji";
import { h } from "virtual-dom";

export default createWidget("dc-topic-title", {
  tagName: "div.dc-topic-title",

  html(attrs, state) {
    return h("h1.fancy-title", replaceEmoji(attrs.title));
  }
});
