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
	  	this.get('controller.model.systems').addObject(system);
	  	system.save();
	},
	
	newNodegroup(landscape){
		store: service();

		const landscapeRecord = this.get('controller.model');
		
		let system = [];

		let arrayPointer = 0;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name == document.getElementById("nSN").value){
				system[arrayPointer] = landscapeRecord.get('systems').objectAt(i);
				arrayPointer++;
			}
		}
		for(let j = 0; j <= arrayPointer; j++){
			const nodeGroup = this.get('store').createRecord('nodegroup', {
				"name": document.getElementById("nNgN").value,
				"parent": system[j]
		  	});

			system[j].get('nodegroups').addObject(nodeGroup);
		}
	},

	newNode(landscape){
		store: service();
		
		const landscapeRecord = this.get('controller.model');
		
		let system = [];

		let systemArrayPointer = 0;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name == document.getElementById("nSN").value){
				system[systemArrayPointer] = landscapeRecord.get('systems').objectAt(i);
				systemArrayPointer++;
			}
		}
		console.log(system);
		let nodegroup = [];
		nodegroup[0] = [];
		let nodegroupArrayPointer = 0;
		for(let i = 0; i < system.length; i++){
			console.log("noch alles ok");
			nodegroupArrayPointer = 0;
			for(let j = 0; j < system[i].get('nodegroups').length; j++){
				if(system[i].get('nodegroups').objectAt(j).name == document.getElementById("nNgN").value){
					nodegroup[i][nodegroupArrayPointer] = system[i].get('nodegroups').objectAt(j);
					nodegroupArrayPointer++;
					console.log("nodegroup gesetzt");
				}		
			}
		}
		console.log(nodegroup);

		for(let i = 0; i < nodegroup.length; i++){
			for(let j = 0; j < nodegroup[i].length; j++){
				const node = this.get('store').createRecord('node', {
					"name": document.getElementById("nNN").value,
					"parent": nodegroup[i][j]  
			  	});

			  	nodegroup[i][j].get('nodes').addObject(node);
			}
		}
	},

	
    resetRoute() {
      // your cleanup code here
    }
  }

});