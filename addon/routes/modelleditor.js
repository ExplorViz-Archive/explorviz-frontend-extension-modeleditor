import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


export default BaseRoute.extend(AlertifyHandler, {


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

		let foundDouble = false;
		
		for(let i =0 ; i < this.get('controller.model.systems').length;i++){
			if(this.get('controller.model.systems').objectAt(i).name === document.getElementById('nSN').value){
				this.showAlertifyMessage("You cannot have two systems with the exact same name.");
				foundDouble = true;
				break;
			}
		}
		if(foundDouble == false){
			const system = this.get('store').createRecord('system', {
				"name": document.getElementById("nSN").value,
				"parent": landscape  
			});	
			this.get('controller.model.systems').addObject(system);
			system.save();
		}
	},
	
	newNodegroup(landscape){
		store: service();

		let foundDouble = false;

		const landscapeRecord = this.get('controller.model');
		
		let changed = false;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name === document.getElementById("nSN").value){
				for(let j = 0 ; j < landscapeRecord.get('systems').objectAt(i).get('nodegroups').length; j++){
					if(landscapeRecord.get('systems').objectAt(i).get('nodegroups').objectAt(j).name === document.getElementById('nNgN').value){
						this.showAlertifyMessage("You cannot have two nodegroups within one system that have the exact same name.");
						foundDouble = true;
						changed = true;
						break;
					}
				}
				if(foundDouble == false){
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
		let foundDouble = false;
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
					for(let k = 0; k < nodegroup.get('nodes').length; k++){
						if(nodegroup.get('nodes').objectAt(k).name === document.getElementById('nNN').value){
							this.showAlertifyMessage("You cannot have two nodes with the exact same name within one nodegroup.");
							foundDouble = true;
							changed = true;
							break;
						}
					}
					if(foundDouble == false){
						const node = this.get('store').createRecord('node', {
							"name": document.getElementById("nNN").value,
							"parent": nodegroup
						});
						nodegroup.get('nodes').addObject(node);
						for(let h = 0; h < nodegroup.get('nodes').objectAt(0).get('applications').length; h++){
							const app = this.get('store').createRecord('application',{
								"name": nodegroup.get('nodes').objectAt(0).get('applications').objectAt(h).name,
								"parent": node
							});
							node.get('applications').addObject(app);
						}
						changed = true;
						break;
					}
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

	newApplication(landscape){
		store: service();
		
		const landscapeRecord = this.get('controller.model');
		
		let changed = false;
		let systemfound = false;
		let nodegroupfound = false;
		let foundDouble = false;
		let system;
		let nodegroup;

		for(let i = 0; i < landscapeRecord.get('systems').length; i++){
			if(landscapeRecord.get('systems').objectAt(i).name === document.getElementById("nSN").value){
				system = landscapeRecord.get('systems').objectAt(i);
				systemfound = true;
				break;
			}
		}
		if(systemfound === true){
			for(let j = 0; j < system.get('nodegroups').length; j++){
				if(system.get('nodegroups').objectAt(j).name === document.getElementById("nNgN").value){
					nodegroup = system.get('nodegroups').objectAt(j);
					nodegroupfound = true;
					break;
				}		
			}
			
			if(nodegroupfound === false){
				this.send('newNodegroup', landscape);
				this.send('newNode', landscape);
				this.send('newApplication', landscape);	
			}
		}else{
			this.send('newSystem', landscape);
			this.send('newNodegroup', landscape);
			this.send('newNode', landscape);
			this.send('newApplication', landscape);
		}

		if(nodegroupfound == true){
			for(let k = 0; k < nodegroup.get('nodes').length; k++){	
				for(let h = 0; h < nodegroup.get('nodes').objectAt(k).get('applications').length; h++){
					if(nodegroup.get('nodes').objectAt(k).get('applications').objectAt(h).name === document.getElementById('nAN').value){
						this.showAlertifyMessage("There is already an application named " + document.getElementById('nAN').value + " in that nodegroup.");
						foundDouble = true;
						break;
					}
				}
				if(foundDouble == false){
					const node = nodegroup.get('nodes').objectAt(k);
					const app = this.get('store').createRecord('application', {
						"name": document.getElementById("nAN").value,
						"parent": node
					});
					node.get('applications').addObject(app);
				}else{break;}
			}
			
		}
		
	},

	delete(landscape){
		//if there is a system by the name of System remove it
		let deleted = false;
		const landscapeRecord = this.get('controller.model');
		for(let i=0; i < landscapeRecord.get('systems').length;i++){
			if(landscapeRecord.get('systems').objectAt(i).name === document.getElementById('nSN').value){
				landscapeRecord.get('systems').removeObject(landscapeRecord.get('systems').objectAt(i));
				deleted = true;
				break;
			}
		}
		if(deleted == false){
			this.showAlertifyMessage("There is no system called " + document.getElementById('nSN').value + " , therefor no system can be deleted.");
		}
	},

	
    resetRoute() {
      // your cleanup code here
    }
  }

});

