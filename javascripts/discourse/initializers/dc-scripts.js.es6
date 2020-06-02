import { withPluginApi } from "discourse/lib/plugin-api";

let scriptsLoaded = false;

export default {
  name: "dc-scripts",
  initialize() {
    withPluginApi("0.8", api => {
      api.onAppEvent("page:changed", () => {
        if (scriptsLoaded) return;

        addScript(
          "script",
          {
            src:
              "https://cdn.jsdelivr.net/gh/GraemeFulton/blm-badge/blmbadge.min.js",
            crossorigin: "anonymous",
            integrity:
              "sha384-RldkbFlAPGpy9ZeGqbY6NuAsZlKyumFmaR1ybYiiN9EvhrTpiSzQ9fwyTk3ieWFG"
          },
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

function addScript(tag, attrs, callback) {
  var script = document.createElement(tag);

  Object.keys(attrs).forEach(key => {
    script.setAttribute(key, attrs[key]);
  });

  script.onload = function afterScriptLoaded() {
    callback();
  };

  document.body.appendChild(script);
}

function addWebComponent(tag, attrs, content) {
  var component = document.createElement(tag);

  Object.keys(attrs).forEach(key => {
    component.setAttribute(key, attrs[key]);
  });
  component.textContent = content;

  document.body.appendChild(component);
}
