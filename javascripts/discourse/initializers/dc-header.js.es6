import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dc-header",
  initialize() {
    withPluginApi("0.8", api => {
      api.reopenWidget("header-icons", {
        html(attrs, state) {
          const html = this._super(attrs, state);
          console.log("html", html);

          const menuWidgetIndex = html.findIndex(widget => {
            if (!widget) return;

            return (
              widget.attrs &&
              widget.attrs.title &&
              widget.attrs.title.includes("hamburger_menu")
            );
          });

          html.splice(menuWidgetIndex, 1);

          return html;
        }
      });
    });
  }
};
