import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-modal-body",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:d-modal-body", {
        /**
         * We are extending this method to pass the showCloseButton parameter
         * We do this to use the behaviour from `dismissable` but also show the close button
         */
        _afterFirstRender() {
          if (
            !this.site.mobileView &&
            this.autoFocus !== "false" &&
            this.element.querySelector("input")
          ) {
            this.element.querySelector("input").focus();
          }

          const maxHeight = this.maxHeight;
          if (maxHeight) {
            const maxHeightFloat = parseFloat(maxHeight) / 100.0;
            if (maxHeightFloat > 0) {
              const viewPortHeight = $(window).height();
              $(this.element).css(
                "max-height",
                Math.floor(maxHeightFloat * viewPortHeight) + "px"
              );
            }
          }

          this.appEvents.trigger(
            "modal:body-shown",
            this.getProperties(
              "title",
              "rawTitle",
              "fixed",
              "subtitle",
              "rawSubtitle",
              "dismissable",
              "showCloseButton",
              "showLogo"
            )
          );
        }
      });
    });
  }
};
