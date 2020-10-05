import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

let popupEnabled = false;

export default {
  name: "dc-popup",
  initialize() {
    withPluginApi("0.8", api => {
      if (!settings.popup_enabled) return;

      api.onAppEvent("page:changed", () => {
        if (popupEnabled) return;

        loadScript(
          "https://unpkg.com/@debtcollective/dc-popup-component@latest/dist/popup-component/popup-component.js"
        );

        addWebComponent(
          "dc-popup",
          {
            id: "dc-popup",
            hero: I18n.t(themePrefix("dc.popup.title")),
            class: "hydrated",
            url: settings.popup_url
          },
          I18n.t(themePrefix("dc.popup.description"))
        );

        popupEnabled = true;
      });
    });
  }
};

function addWebComponent(tag, attrs, content) {
  var component = document.createElement(tag);

  Object.keys(attrs).forEach(key => {
    component.setAttribute(key, attrs[key]);
  });
  component.textContent = content;

  document.body.appendChild(component);
}
