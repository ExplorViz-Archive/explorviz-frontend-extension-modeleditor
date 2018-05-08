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
    //
	newSystem(landscape){
		store: service();
		//TODO: look for doubles
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
		
		let changed = false;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name === document.getElementById("nSN").value){
				//TODO: look for doubles
				const system = landscapeRecord.get('systems').objectAt(i);
				const nodeGroup = this.get('store').createRecord('nodegroup', {
				"name": document.getElementById("nNgN").value,
				"parent": system
		  		});
				system.get('nodegroups').addObject(nodeGroup);
				changed = true;
				break;
			}
		}
		if(changed === false){
			this.send('newSystem', landscape);
			this.send('newNodegroup', landscape);
		}

	},

	newNode(landscape){
		store: service();
		
		const landscapeRecord = this.get('controller.model');
		
		let changed = false;
		let systemfound = false;
		let system;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name === document.getElementById("nSN").value){
				system = landscapeRecord.get('systems').objectAt(i);
				systemfound = true;
				break;
			}
		}
		if(systemfound === true){
			let nodegroup;
			
			for(let j = 0; j < system.get('nodegroups').length; j++){
				if(system.get('nodegroups').objectAt(j).name === document.getElementById("nNgN").value){
					nodegroup = system.get('nodegroups').objectAt(j);
					const node = this.get('store').createRecord('node', {
						"name": document.getElementById("nNN").value,
						"parent": nodegroup
				  	});

				  	nodegroup.get('nodes').addObject(node);
				  	changed = true;
				  	break;
				}		
			}

			if(changed === false){
				this.send('newNodegroup', landscape);
				this.send('newNode', landscape);
			}
		}
		else{
			this.send('newSystem', landscape);
			this.send('newNodegroup', landscape);
			this.send('newNode', landscape);
		}
	},

	
    resetRoute() {
      // your cleanup code here
    }
  }

});