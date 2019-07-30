import { withPluginApi } from "discourse/lib/plugin-api";
import { on } from "ember-addons/ember-computed-decorators";

// https://github.com/framework7io/framework7/blob/master/src/core/utils/device.js
const getDeviceInfo = () => {
  const Support = {
    touch: (function checkTouch() {
      return !!(
        window.navigator.maxTouchPoints > 0 ||
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
      );
    })()
  };
  const platform = window.navigator.platform;
  const ua = window.navigator.userAgent;

  const device = {
    ios: false,
    android: false,
    androidChrome: false,
    desktop: false,
    windowsPhone: false,
    iphone: false,
    iphoneX: false,
    ipod: false,
    ipad: false,
    edge: false,
    ie: false,
    firefox: false,
    macos: false,
    windows: false,
    cordova: !!(window.cordova || window.phonegap),
    phonegap: !!(window.cordova || window.phonegap),
    electron: false
  };

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const windowsPhone = ua.match(/(Windows Phone);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const iphoneX =
    iphone &&
    ((screenWidth === 375 && screenHeight === 812) || // X/XS
      (screenWidth === 414 && screenHeight === 896)); // XR / XS Max
  const ie = ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
  const edge = ua.indexOf("Edge/") >= 0;
  const firefox = ua.indexOf("Gecko/") >= 0 && ua.indexOf("Firefox/") >= 0;
  const windows = platform === "Win32";
  const electron = ua.toLowerCase().indexOf("electron") >= 0;
  let macos = platform === "MacIntel";

  // iPadOs 13 fix
  if (
    !ipad &&
    macos &&
    Support.touch &&
    ((screenWidth === 1024 && screenHeight === 1366) || // Pro 12.9
    (screenWidth === 834 && screenHeight === 1194) || // Pro 11
    (screenWidth === 834 && screenHeight === 1112) || // Pro 10.5
      (screenWidth === 768 && screenHeight === 1024)) // other
  ) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    macos = false;
  }

  device.ie = ie;
  device.edge = edge;
  device.firefox = firefox;

  // Windows
  if (windowsPhone) {
    device.os = "windowsPhone";
    device.osVersion = windowsPhone[2];
    device.windowsPhone = true;
  }
  // Android
  if (android && !windows) {
    device.os = "android";
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf("chrome") >= 0;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  // iOS
  if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, ".");
    device.iphone = true;
    device.iphoneX = iphoneX;
  }
  if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, ".");
    device.ipad = true;
  }
  if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, ".") : null;
    device.ipod = true;
  }
  // iOS 8+ changed UA
  if (device.ios && device.osVersion && ua.indexOf("Version/") >= 0) {
    if (device.osVersion.split(".")[0] === "10") {
      device.osVersion = ua
        .toLowerCase()
        .split("version/")[1]
        .split(" ")[0];
    }
  }

  // Webview
  device.webView =
    !!(
      (iphone || ipad || ipod) &&
      (ua.match(/.*AppleWebKit(?!.*Safari)/i) || window.navigator.standalone)
    ) ||
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches);
  device.webview = device.webView;
  device.standalone = device.webView;

  // Desktop
  device.desktop =
    !(device.ios || device.android || device.windowsPhone) || electron;
  if (device.desktop) {
    device.electron = electron;
    device.macos = macos;
    device.windows = windows;
    if (device.macos) {
      device.os = "macos";
    }
    if (device.windows) {
      device.os = "windows";
    }
  }

  // Pixel Ratio
  device.pixelRatio = window.devicePixelRatio || 1;

  return device;
};

export default {
  name: "debtcollective-html-classes",
  initialize() {
    withPluginApi("0.8.9", api => {
      api.modifyClass("component:site-header", {
        @on("init")
        addDeviceHTMLClasses() {
          const device = getDeviceInfo();
          const supportOverflowClass =
            Number(device.os) >= 13
              ? "support-overflow-hidden"
              : "not-support-overflow-hidden";
          const osClass = `device-${device.os}`;
          const osVersionClass = !device.desktop
            ? `${osClass} ${osClass}-${device.osVersion.replace(/\./g, "-")}`
            : "";

          // Ideally, follow the expectations from https://framework7.io/docs/device.html
          $("html").addClass(
            `${osClass} ${osVersionClass} ${supportOverflowClass}`
          );
        }
      });
    });
  }
};
