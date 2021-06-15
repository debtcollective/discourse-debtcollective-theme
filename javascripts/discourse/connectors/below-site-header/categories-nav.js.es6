import Category from "discourse/models/category";

export default {
  shouldRender(args, component) {
    return (
      settings.header_categories_visible &&
      (settings.header_categories !== "" ||
        settings.header_categories_custom_links !== "")
    );
  }
};
