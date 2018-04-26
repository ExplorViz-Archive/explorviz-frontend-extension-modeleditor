import Router from "explorviz-frontend/router";

export function initialize(appInstance) {

  const service = appInstance.lookup("service:page-setup");

  if(service){
    service.get("navbarRoutes").push("modelleditor");
  }

  Router.map(function() {
    this.route("modelleditor");
  });
}

export default {
  name: 'explorviz-frontend-extension-modelleditor',
  initialize
};