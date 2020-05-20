import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

let popupEnabled = false;

export default {
  name: "dc-popup",
  initialize() {
    withPluginApi("0.8", api => {
      api.onAppEvent("page:changed", () => {
        if (popupEnabled) return;

        loadScript(
          "https://unpkg.com/@debtcollective/dc-popup-component@0.0.1/dist/popup-component/popup-component.js"
        );

        addWebComponent(
          "dc-popup",
          {
            id: "dc-popup",
            hero: "We've got a new look! What do you think?",
            class: "hydrated",
            url:
              "https://community.debtcollective.org/t/user-experience-feedback-new-theme/4110"
          },
          `Noticed the new layout for the Debt Collective Community platform? Implementing this took a
              lot of time and effort and we want to make sure the new system works for you.
              So, please let us know what is working well and what you may want to see done better!`
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
