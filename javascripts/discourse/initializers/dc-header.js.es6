import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-header",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("component:site-header", {
        afterRender() {
          this._super();

          const searchButton = this.element.querySelector("#search-button");

          if ($(searchButton).hasClass("material-icons")) return;

          $(searchButton)
            .addClass("material-icons")
            .html("search");
        }
      });

      api.reopenWidget("header-notifications", {
        html(attrs, state) {
          const html = this._super(attrs, state);
          const profileImage = html.find(widget => {
            if (!widget) return;

            return widget.tagName === "IMG";
          });

          return profileImage;
        }
      });

      api.reopenWidget("header-icons", {
        html(attrs, state) {
          const html = this._super(attrs, state);

          const menuWidgetIndex = html.findIndex(widget => {
            if (!widget) return;

            return (
              widget.attrs &&
              widget.attrs.title &&
              widget.attrs.title.includes("hamburger_menu")
            );
          });

          // remove the hamburguer menu
          html.splice(menuWidgetIndex, 1);

          return html;
        }
      });
    });
  }
};
