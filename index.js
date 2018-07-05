'use strict';

module.exports = {
  name: 'explorviz-frontend-extension-modelleditor',
  
  included: function(app) {
    this._super.included.apply(this, arguments);    
    app.import('vendor/explorviz-frontend-extension-modelleditor-style.css');
  },

  isDevelopingAddon() {
    return true;
  }
};
