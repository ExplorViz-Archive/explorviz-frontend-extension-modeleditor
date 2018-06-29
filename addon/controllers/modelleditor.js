import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import LandscapeInteraction from 'explorviz-frontend/utils/landscape-rendering/interaction';
import ApplicationInteraction from 'explorviz-frontend/utils/application-rendering/interaction';

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

  showLandscape: computed('modellRepo.modellApplication', function() {
	return !this.get('modellRepo.modellApplication');
  }),

	initMyListeners() {
		const landscapeInteraction = LandscapeInteraction.create(getOwner(this).ownerInjection());
		const self = this;
		landscapeInteraction.handleDoubleClick = function(mouse) {
			const origin = {};

			origin.x = ((mouse.x - (this.get('renderer').domElement.offsetLeft+0.66)) /
				this.get('renderer').domElement.clientWidth) * 2 - 1;

			origin.y = -((mouse.y - (this.get('renderer').domElement.offsetTop+0.665)) /
				this.get('renderer').domElement.clientHeight) * 2 + 1;

			const intersectedViewObj = this.get('raycaster').raycasting(null, origin,
				this.get('camera'), this.get('raycastObjects'));

			let emberModel;

			if(intersectedViewObj) {

				// hide tooltip
				this.get('popUpHandler').hideTooltip();

				emberModel = intersectedViewObj.object.userData.model;
				const emberModelName = emberModel.constructor.modelName;

				if(emberModelName === "application"){
					// data available => open application-rendering
					this.closeAlertifyMessages();
					self.set('modellRepo.modellApplication', emberModel);
				}
				else if (emberModelName === "nodegroup" || emberModelName === "system"){
					emberModel.setOpened(!emberModel.get('opened'));
					this.trigger('redrawScene');
				}
				else if(emberModelName === "component"){
					emberModel.setOpenedStatus(!emberModel.get('opened'));
					emberModel.set('highlighted', false);
					this.trigger('redrawScene');
				}

			}

			this.trigger('doubleClick', emberModel);

		}


		this.set('landscapeInteraction', landscapeInteraction);

		this.get('landscapeInteraction').on('singleClick', function(emberModel) {
			switch(emberModel.constructor.modelName){
				case "application":
					document.getElementById('nSN').value = emberModel.get('parent').get('parent').get('parent').get('name');		
					document.getElementById('cPS1').value = emberModel.get('parent').get('parent').get('parent').get('name');		
					document.getElementById('nNgN').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('cPNG1').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('nNN').value = emberModel.get('parent').get('name');
					document.getElementById('cPN1').value = emberModel.get('parent').get('name');
					document.getElementById('nAN').value = emberModel.get('name');		
					document.getElementById('cPA1').value = emberModel.get('name');		
					break;
				case "node":
					document.getElementById('nSN').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('cPS1').value = emberModel.get('parent').get('parent').get('name');		
					document.getElementById('nNgN').value = emberModel.get('parent').get('name');		
					document.getElementById('cPNG1').value = emberModel.get('parent').get('name');		
					document.getElementById('nNN').value = emberModel.get('name');
					document.getElementById('cPN1').value = emberModel.get('name');
					document.getElementById('nAN').value = "to be selected";		
					document.getElementById('cPA1').value = "to be selected";		
					break;
				case "nodegroup":
					document.getElementById('nSN').value = emberModel.get('parent').get('name');		
					document.getElementById('cPS1').value = emberModel.get('parent').get('name');		
					document.getElementById('nNgN').value = emberModel.get('name');		
					document.getElementById('cPNG1').value = emberModel.get('name');		
					document.getElementById('nNN').value = "to be selected";
					document.getElementById('cPN1').value = "to be selected";
					document.getElementById('nAN').value = "to be selected";		
					document.getElementById('cPA1').value = "to be selected";		
					break;
				case "system":
					document.getElementById('nSN').value = emberModel.get('name');		
					document.getElementById('cPS1').value = emberModel.get('name');		
					document.getElementById('nNgN').value = "to be selected";
					document.getElementById('cPNG1').value = "to be selected";
					document.getElementById('nNN').value = "to be selected";
					document.getElementById('cPN1').value = "to be selected";
					document.getElementById('nAN').value = "to be selected";
					document.getElementById('cPA1').value = "to be selected";
					break;
				case "applicationcommunication":
					//alertify or debug or something
					break;
			}
		});

		//this should be rightclicking and linking it to the second model
		//TODO: research what rightclicking is in this context

		// this.get('landscapeInteraction').on('contextMenu', function(emberModel) {
		// 	switch(emberModel.constructor.modelName){
		// 		case "application":
		// 			document.getElementById('cPS2').value = emberModel.get('parent').get('parent').get('parent').get('name');		
		// 			document.getElementById('cPNG2').value = emberModel.get('parent').get('parent').get('name');		
		// 			document.getElementById('cPN2').value = emberModel.get('parent').get('name');
		// 			document.getElementById('cPA2').value = emberModel.get('name');		
		// 			break;
		// 		case "node":
		// 			document.getElementById('cPS2').value = emberModel.get('parent').get('parent').get('name');		
		// 			document.getElementById('cPNG2').value = emberModel.get('parent').get('name');		
		// 			document.getElementById('cPN2').value = emberModel.get('name');
		// 			document.getElementById('cPA2').value = "to be selected";		
		// 			break;
		// 		case "nodegroup":
		// 			document.getElementById('cPS2').value = emberModel.get('parent').get('name');		
		// 			document.getElementById('cPNG2').value = emberModel.get('name');		
		// 			document.getElementById('cPN2').value = "to be selected";
		// 			document.getElementById('cPA2').value = "to be selected";		
		// 			break;
		// 		case "system":
		// 			document.getElementById('cPS2').value = emberModel.get('name');		
		// 			document.getElementById('cPNG2').value = "to be selected";
		// 			document.getElementById('cPN2').value = "to be selected";
		// 			document.getElementById('cPA2').value = "to be selected";
		// 			break;
		// 		case "applicationcommunication":
		// 			//alertify or debug or something
		// 			break;
		// 	}
		// });


		const applicationInteraction = ApplicationInteraction.create(getOwner(this).ownerInjection());
		applicationInteraction.handleSingleClick = function(mouse) {
			const origin = {};

			origin.x = ((mouse.x - (this.get('renderer').domElement.offsetLeft+0.66)) / 
			this.get('renderer').domElement.clientWidth) * 2 - 1;

			origin.y = -((mouse.y - (this.get('renderer').domElement.offsetTop+0.665)) / 
			this.get('renderer').domElement.clientHeight) * 2 + 1;

			const intersectedViewObj = this.get('raycaster').raycasting(null, origin, 
			this.get('camera'), this.get('raycastObjects'));

			let emberModel;

			if(intersectedViewObj) {
				// Hide (old) tooltip
				this.get('popUpHandler').hideTooltip();

				emberModel = intersectedViewObj.object.userData.model;
				const emberModelName = emberModel.constructor.modelName;

				if(emberModelName === "component"){
					if(emberModel.get('parentComponent').get('fullQualifiedName')) {
						document.getElementById('nPComponentN').value =  emberModel.get('fullQualifiedName');
					}else{
						document.getElementById('nPComponentN').value =  "";
					}
				}
				if(emberModelName === 'clazz'){
					document.getElementById('nPComponentN').value =  emberModel.get('parent').get('fullQualifiedName');
					document.getElementById('nClazzN').value = emberModel.get('name');
				}
			}
			this.trigger('singleClick', emberModel);
		};
		this.set('applicationInteraction', applicationInteraction);

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