import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
//import Jsonapi from 'explorviz-frontend/app/storagemodel/jsonapi';


export default BaseRoute.extend(AlertifyHandler, {

	modellRepo: service('modell-repository'),
	landscapeRepo: service('repos/landscape-repository'),
	store: service(),
	renderingService: service("rendering-service"),

	model() {

	  const landscape = this.get('store').createRecord('landscape',{
		  "timestamp": Math.floor(Math.random() * 100000),
		  "id": Math.floor(Math.random() * 10000)
	  });

	  const adapterOptions = {filename:"filenametest"};

	  ////landscape.save();
	  if(!this.get('modellRepo.modellLandscape')) {
	  		this.set('modellRepo.modellLandscape', landscape);
		}
	  return landscape;
	},
  actions: {
    // @Override BaseRoute
    //
    newModel(landscape){
    	//TODO: find the name in document.getElementById('nMN').value and set it to the model timestamp!

    },


	newSystem(landscape){
		let foundDouble = false;
		
		for(let i =0 ; i < this.get('controller.model.systems').length;i++){
			if(this.get('controller.model.systems').objectAt(i).name === document.getElementById('nSN').value){
				this.showAlertifyMessage("You cannot have two systems with the exact same name.");
				foundDouble = true;
				break;
			}
		}
		if(foundDouble === false){
			const system = this.get('store').createRecord('system', {
				"name": document.getElementById("nSN").value,
				"parent": landscape,
				"id": Math.floor(Math.random() * 10000)
			});	
			this.get('controller.model.systems').addObject(system);
			////landscape.save();
			landscape.get('systems').addObject(system);
			this.set('modellRepo.modellLandscape', landscape);
			this.get('renderingService').reSetupScene();
		}
	},
	
	newNodegroup(landscape){

		let foundDouble = false;
		
		let changed = false;

		for(let i = 0; i < landscape.get('systems').length; i++){
			if(landscape.get('systems').objectAt(i).name === document.getElementById("nSN").value){
				for(let j = 0 ; j < landscape.get('systems').objectAt(i).get('nodegroups').length; j++){
					if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).name === document.getElementById('nNgN').value){
						this.showAlertifyMessage("You cannot have two nodegroups within one system that have the exact same name.");
						foundDouble = true;
						changed = true;
						break;
					}
				}
				if(foundDouble === false){
					const system = landscape.get('systems').objectAt(i);
					const nodeGroup = this.get('store').createRecord('nodegroup', {
					"name": document.getElementById("nNgN").value,
					"parent": system,
					"id": Math.floor(Math.random() * 10000)
			  		});
					system.get('nodegroups').addObject(nodeGroup);

					//landscape.save();
					this.set('modellRepo.modellLandscape', landscape);
					changed = true;
					this.get('renderingService').reSetupScene();
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
		
		const landscapeRecord = landscape;
		
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
					if(foundDouble === false){
						const node = this.get('store').createRecord('node', {
							"name": document.getElementById("nNN").value,
							"parent": nodegroup,
							"ipAddress": "0.0.0.0",
							"id": Math.floor(Math.random() * 10000)
						});
						nodegroup.get('nodes').addObject(node);
						for(let h = 0; h < nodegroup.get('nodes').objectAt(0).get('applications').length; h++){
							const app = this.get('store').createRecord('application',{
								"name": nodegroup.get('nodes').objectAt(0).get('applications').objectAt(h).name,
								"parent": node,
								"programmingLanguage": "Java",
								"id": Math.floor(Math.random() * 10000)
							});
							node.get('applications').addObject(app);
							//landscape.save();
							this.set('modellRepo.modellLandscape', landscape);
							this.get('renderingService').reSetupScene();
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

		if(nodegroupfound === true){
			for(let k = 0; k < nodegroup.get('nodes').length; k++){	
				for(let h = 0; h < nodegroup.get('nodes').objectAt(k).get('applications').length; h++){
					if(nodegroup.get('nodes').objectAt(k).get('applications').objectAt(h).name === document.getElementById('nAN').value){
						this.showAlertifyMessage("There is already an application named " + document.getElementById('nAN').value + " in that nodegroup.");
						foundDouble = true;
						break;
					}
				}
				if(foundDouble === false){
					const node = nodegroup.get('nodes').objectAt(k);
					const app = this.get('store').createRecord('application', {
						"name": document.getElementById("nAN").value,
						"parent": node,
						"programmingLanguage": "Java",
						"id": Math.floor(Math.random() * 10000)
					});
					node.get('applications').addObject(app);
					//landscape.save();
					this.set('modellRepo.modellLandscape', landscape);
					this.get('renderingService').reSetupScene();
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
		if(deleted === false){
			this.showAlertifyMessage("There is no system called " + document.getElementById('nSN').value + " , therefor no system can be deleted.");
		}
	},

	
    resetRoute() {
      // your cleanup code here
    }
  }

});

