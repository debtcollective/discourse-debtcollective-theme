import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { inject as service } from "@ember/service";

export default {
  name: "dc-header-imported",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:site-header", {
        router: service(),
        didRender() {
          this._super();
          const header = document.querySelector("#dc-header");

          header.addEventListener("linkClicked", ({ detail }) => {
            console.log("linkClicked", detail);

            if (detail.namespace === "profile") {
              if (
                detail.to.charAt(0) === "/" ||
                detail.to.match(location.origin)
              ) {
                this.router.transitionTo(detail.to);
                detail.event.preventDefault();
              }
            }
          });
        }
      });
    });
  }
};
