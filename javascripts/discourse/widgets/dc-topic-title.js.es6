import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";

export default createWidget("dc-topic-title", {
  tagName: "div.dc-topic-title",

  html(attrs, state) {
    return h("div.embed-topic-title", "");
  }
});
