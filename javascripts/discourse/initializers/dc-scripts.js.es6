import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

let scriptsLoaded = false;

export default {
  name: "dc-scripts",
  initialize() {
    withPluginApi("0.8", api => {
      api.onAppEvent("page:changed", () => {
        if (scriptsLoaded) return;

        loadScript("https://makerbadge.s3.amazonaws.com/blmbadge.js").then(
          () => {
            BLMBadge.init({
              layout: 1,
              theme: "dark",
              promoText: "Send a donation " + String.fromCodePoint(0x2192),
              promoLink: "https://minnesotafreedomfund.org/",
              message: "To be silent is to be complicit. Black lives matter.",
              title: "#BlackLivesMatter"
            });
          }
        );

        scriptsLoaded = true;
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
