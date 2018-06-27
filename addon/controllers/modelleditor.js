import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { getOwner } from '@ember/application';
import LandscapeInteraction from 'explorviz-frontend/utils/landscape-rendering/interaction';

/**
* TODO
*
* @class Visualization-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule visualization
*/
export default Controller.extend({

  urlBuilder: service("url-builder"),
  viewImporter: service("view-importer"),
  reloadHandler: service("reload-handler"),
  renderingService: service("rendering-service"),
  modellRepo: service('modell-repository'),
  //landscapeRepo: service('repos/landscape-repository'),
  store: service(),

  state: null,

  // Specify query parameters
  queryParams: ['timestamp', 'appID', 'camX', 'camY', 'camZ', 'condition'],

  type: 'landscape',

  // query parameter serialized into strings
  timestamp: null,
  appID: null,
  camX: null,
  camY: null,
  camZ: null,
  condition: null,


  //why does show Landscape only request an application?
  showLandscape: computed('modellRepo.modellApplication', function() {
    return !this.get('modellRepo.modellApplication');
  }),

	initMyListeners() {
	    const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
	    this.set('landscapeInteraction', landscapeInteraction);

	    this.get('landscapeInteraction').on('singleClick', function(emberModel) {
			switch(emberModel.constructor.modelName){
				case "application":
					document.getElementById('cPS1').value = emberModel.get('parent').get('parent').get('parent').get('name');		
					document.getElementById('cPNG1').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('cPN1').value = emberModel.get('parent').get('name');
					document.getElementById('cPA1').value = emberModel.get('name');		
					break;
				case "node":
					document.getElementById('cPS1').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('cPNG1').value = emberModel.get('parent').get('name');		
					document.getElementById('cPN1').value = emberModel.get('name');
					document.getElementById('cPA1').value = "to be selected";		
					break;
				case "nodegroup":
					document.getElementById('cPS1').value = emberModel.get('parent').get('name');		
					document.getElementById('cPNG1').value = emberModel.get('name');		
					document.getElementById('cPN1').value = "to be selected";
					document.getElementById('cPA1').value = "to be selected";		
					break;
				case "system":
					document.getElementById('cPS1').value = emberModel.get('name');		
					document.getElementById('cPNG1').value = "to be selected";
					document.getElementById('cPN1').value = "to be selected";
					document.getElementById('cPA1').value = "to be selected";
					break;
				case "applicationcommunication":
					//alertify or debug or something
					break;
			}
	    });

	    this.get('landscapeInteraction').on('doubleClick', function(emberModel) {
	      console.log(emberModel);
	    });
	  },

  actions: {

    resetView() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.get('reloadHandler').startExchange();
    }
    
  },

  showTimeline() {
    this.set('renderingService.showTimeline', true);
  },

  hideVersionbar(){
    this.set('renderingService.showVersionbar', false);
  },

  // @Override
  init() {
    this._super(...arguments);

    const self = this;

    this.set('condition', []);

    // setup url-builder Service
    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });

    // Listen for component request
    this.get('viewImporter').on('requestView', function() {
      const newState = {};
      // Get and convert query params

      newState.timestamp = self.get('timestamp');
      newState.appID = self.get('appID');

      newState.camX = parseFloat(self.get('camX'));
      newState.camY = parseFloat(self.get('camY'));
      newState.camZ = parseFloat(self.get('camZ'));
      newState.condition = self.get('condition');

      // Passes the new state from controller via service to component
      self.get('viewImporter').transmitView(newState);
    });
    this.initMyListeners();
  },

  // @Override
  cleanup() {
    this._super(...arguments);
    this.get('urlBuilder').off('transmitState');
    this.get('viewImporter').off('requestView');
  }
});