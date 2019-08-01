import { withPluginApi } from "discourse/lib/plugin-api";
import { on } from "ember-addons/ember-computed-decorators";
import Device from "../../helpers/device";

const getSupportOverflowClass = () => {
  const majorVersion = Device.osVersion && Device.osVersion.split(".")[0];
  return (Device.os === "ios" && majorVersion >= 13) || Device.desktop
    ? "support-overflow-hidden"
    : "not-support-overflow-hidden";
};

export default {
  name: "debtcollective-html-classes",
  initialize() {
    withPluginApi("0.8.9", api => {
      api.modifyClass("component:site-header", {
        @on("init")
        addDeviceHTMLClasses() {
          const overflowClass = getSupportOverflowClass();
          $("html").addClass(overflowClass);
        }
      });
    });
  }
};
