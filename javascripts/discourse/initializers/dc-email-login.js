import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { withPluginApi } from "discourse/lib/plugin-api";
import DiscourseURL from "discourse/lib/url";

export default {
  name: "dc-email-login",
  initialize() {
    withPluginApi("0.8.24", (api) => {
      api.modifyClass("controller:emailLogin", {
        actions: {
          finishLogin() {
            let data = {
              second_factor_method: this.secondFactorMethod,
              timezone: moment.tz.guess(),
            };
            if (this.securityKeyCredential) {
              data.second_factor_token = this.securityKeyCredential;
            } else {
              data.second_factor_token = this.secondFactorToken;
            }

            ajax({
              url: `/session/email-login/${this.model.token}`,
              type: "POST",
              data: data,
            })
              .then((result) => {
                if (result.success) {
                  const redirectTo = result.redirect_to || "/";

                  DiscourseURL.redirectTo(redirectTo);
                } else {
                  this.set("model.error", result.error);
                }
              })
              .catch(popupAjaxError);
          },
        },
      });
    });
  },
};
