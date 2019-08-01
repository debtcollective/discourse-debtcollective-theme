import { withPluginApi } from "discourse/lib/plugin-api";
import { on } from "ember-addons/ember-computed-decorators";
import Device from "../../helpers/device";

const getiOSClasses = () => {
  if (Device.desktop || Device.os !== "ios") {
    return "";
  }

  const supportOverflowClass =
    Number(Device.osVersion) >= 13
      ? "support-overflow-hidden"
      : "not-support-overflow-hidden";
  const osClass = `device-${Device.os}`;
  const osVersionClass = `${osClass}-${Device.osVersion.split(".")[0]}`;

  return `${osClass} ${osVersionClass} ${supportOverflowClass}`;
};

export default {
  name: "debtcollective-html-classes",
  initialize() {
    withPluginApi("0.8.9", api => {
      api.modifyClass("component:site-header", {
        @on("init")
        addDeviceHTMLClasses() {
          const iOSClasses = getiOSClasses();
          $("html").addClass(iOSClasses);
        }
      });
    });
  }
};
