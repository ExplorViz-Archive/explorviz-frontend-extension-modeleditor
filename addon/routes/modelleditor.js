import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';


export default BaseRoute.extend(AuthenticatedRouteMixin, {


	model() {
	  store: service();

	  const landscape = this.get('store').createRecord('landscape',{
		  "timestamp": 12345,
		  "exceptions": "this works exceptionally idkw2"
	  });
	  return landscape;
	},
  actions: {
    // @Override BaseRoute
	newNode(landscape){
		store: service();

		const system1 = this.get('store').createRecord('system', {
			"name": "bla-keks",
			"parent": landscape  
	  	});
	  	const system2 = this.get('store').createRecord('system', {
			"name": "bla-kekse",
			"parent": landscape 
	  	});

		const systems = [system1, system2]


		//landscape.systems = [system1, system2];	
	},
	
	newNodegroup(){
		alert('das wird schonmal gemacht! actions sind einfach das Beste!');
		
	},
	
    resetRoute() {
      // your cleanup code here
    }
  }

});