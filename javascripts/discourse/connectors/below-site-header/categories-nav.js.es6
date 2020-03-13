import Category from "discourse/models/category";

export default {
  shouldRender(args, component) {
    return settings.header_categories !== "";
  }
};
