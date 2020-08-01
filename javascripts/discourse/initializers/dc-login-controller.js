import I18n from "I18n";
import EmberObject from "@ember/object";
import { next } from "@ember/runloop";
import showModal from "discourse/lib/show-modal";
import { withPluginApi } from "discourse/lib/plugin-api";

// Login controller on Discourse doesn't export this constant
const AuthErrors = [
  "requires_invite",
  "awaiting_approval",
  "awaiting_activation",
  "admin_not_allowed_from_ip_address",
  "not_allowed_from_ip_address"
];

export default {
  name: "dc-login-controller",
  initialize() {
    withPluginApi("0.8", api => {
      api.modifyClass("controller:login", {
        authenticationComplete(options) {
          const loginError = (errorMsg, className, callback) => {
            showModal("login");

            next(() => {
              if (callback) callback();
              this.flash(errorMsg, className || "success");
            });
          };

          if (
            options.awaiting_approval &&
            !this.canLoginLocal &&
            !this.canLoginLocalWithEmail
          ) {
            this.set("awaitingApproval", true);
          }

          if (options.omniauth_disallow_totp) {
            return loginError(
              I18n.t("login.omniauth_disallow_totp"),
              "error",
              () => {
                this.setProperties({
                  loginName: options.email,
                  showLoginButtons: false
                });

                document.getElementById("login-account-password").focus();
              }
            );
          }

          for (let i = 0; i < AuthErrors.length; i++) {
            const cond = AuthErrors[i];
            if (options[cond]) {
              return loginError(I18n.t(`login.${cond}`));
            }
          }

          if (options.suspended) {
            return loginError(options.suspended_message, "error");
          }

          if (options.authenticated) {
            const ssoDestinationUrl = $.cookie("sso_destination_url");
            const destinationUrl =
              $.cookie("destination_url") || options.destination_url;

            // DC modification
            // SSO redirection
            if (ssoDestinationUrl) {
              $.removeCookie("sso_destination_url");
              window.location.href = ssoDestinationUrl;
            }

            if (destinationUrl) {
              // redirect client to the original URL
              $.removeCookie("destination_url");
              window.location.href = destinationUrl;
            } else if (
              window.location.pathname === Discourse.getURL("/login")
            ) {
              window.location = Discourse.getURL("/");
            } else {
              window.location.reload();
            }
            return;
          }

          const createAccountController = this.createAccount;
          createAccountController.setProperties({
            accountEmail: options.email,
            accountUsername: options.username,
            accountName: options.name,
            authOptions: EmberObject.create(options)
          });

          showModal("createAccount");
        }
      });
    });
  }
};
