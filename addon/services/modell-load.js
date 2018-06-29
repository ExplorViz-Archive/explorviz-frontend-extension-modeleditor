import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { inject as service } from "@ember/service";
import Service from '@ember/service';

/**
* This service loads the modell landscape.
*
* @class Modell-Load-Service
* @extends Ember.Service
*/
export default Service.extend(AlertifyHandler, {

store: service('store'),
modellRepo: service('modell-repository'),

//one doesn't need timestamps or a modell from the backend so this whole function is not necessary ?
  receiveMergedLandscape(timestamps){
    const self = this;

    this.debug("start modell-landscape-fetch");
    this.get("store").adapterFor('landscape').set('namespace', 'extension/modell');
    this.get("store").queryRecord("landscape", "landscape/modell/" + timestamps).then(success, failure).catch(error);

    //------------- Start of inner functions of updateObject ---------------
    function success(landscape){
      self.set('mergedRepo.mergedLandscape', landscape);
      self.get('mergedRepo').triggerUpdate();
      self.debug("end modell-landscape-fetch");
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }

    function failure(e){
      self.showAlertifyMessage("Modell Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Modell Landscape couldn't be requested!", e);
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }

    function error(e){
      this.showAlertifyMessage(e);
      self.get("store").adapterFor('landscape').set('namespace', 'landscape');
    }
  }
});