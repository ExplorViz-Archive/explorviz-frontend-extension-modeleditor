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
	  landscape.save();
	  return landscape;
	},
  actions: {
    // @Override BaseRoute
    //adds a new node to a nodegroup 'nodegroup' with the name 'name'
	newSystem(landscape){
		store: service();

		const system = this.get('store').createRecord('system', {
			"name": document.getElementById("nSN").value,
			"parent": landscape  
	  	});	
	  	system.save();
	},
	
	newNodegroup(landscape){
		store: service();
		console.log(landscape.timestamp);
		console.log(landscape.systems);

		const nodeGroup = this.get('store').createRecord('nodegroup', {
			"name": document.getElementById("nNgN"),
			"parent": landscape.systems[0]
	  	});

	},

	newNode(nodegroup){
		store: service();
		
		const node = this.get('store').createRecord('node', {
			"name": document.getElementById("nNN"),
			"parent": nodegroup  
	  	});

	},

	
    resetRoute() {
      // your cleanup code here
    }
  }

});