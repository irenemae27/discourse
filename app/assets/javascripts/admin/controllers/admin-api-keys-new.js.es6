import { default as computed } from "ember-addons/ember-computed-decorators";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Ember.Controller.extend({
  userModes: [
    { id: "all", name: I18n.t("admin.api.all_users") },
    { id: "single", name: I18n.t("admin.api.single_user") }
  ],

  @computed("userMode")
  showUserSelector(mode) {
    return mode === "single";
  },

  @computed("model.description", "model.username", "userMode")
  saveDisabled(description, username, userMode) {
    if (Ember.isBlank(description)) return true;
    if (userMode === "single" && Ember.isBlank(username)) return true;
    return false;
  },

  actions: {
    changeUserMode(value) {
      if (value === "all") {
        this.model.set("username", null);
      }
      this.set("userMode", value);
    },

    save() {
      this.model
        .save()
        .then(() => {
          this.transitionToRoute("adminApiKeys.show", this.model.id);
        })
        .catch(popupAjaxError);
    }
  }
});
