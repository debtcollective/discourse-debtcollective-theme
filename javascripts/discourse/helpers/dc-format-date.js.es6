import { registerUnbound } from "discourse-common/lib/helpers";
import { shortDate } from "discourse/lib/formatter";

/**
 * Avoid the need of open components and modify models
 * in order to format the date with Discourse shortDate
 * function. Examples of usage of this function can be found
 * at https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/app/controllers/composer.js#L454
 */
registerUnbound("dc-format-date", function(val) {
  return new Handlebars.SafeString(shortDate(val));
});

registerUnbound("dc-relative-date", function(val) {
  return new Handlebars.SafeString(moment(val).fromNow());
});
