import Component from '@ember/component';
import { inject as service } from "@ember/service";
import layout from '../templates/components/navbar-resetview';


export default Component.extend({

	layout,

	tagName: '',

	modellRepo: service('modell-repository'),
	renderingService: service("rendering-service"),
	
	actions:{
		resetApplication(){
			this.set('modellRepo.modellApplication', null);
			this.get('renderingService').reSetupScene();
		}
	}

});

