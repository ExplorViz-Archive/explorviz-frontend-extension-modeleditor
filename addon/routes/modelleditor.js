import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
//import Jsonapi from 'explorviz-frontend/app/storagemodel/jsonapi';


export default BaseRoute.extend(AlertifyHandler, {

	modellRepo: service('modell-repository'),
	//landscapeRepo: service('repos/landscape-repository'),
	store: service(),
	renderingService: service("rendering-service"),
	//idCounter will count upward only and tell us which ID is to be used next, there shouldn't be too much difficulty as to hyperthreading and multithreading in JS 
	//but there are IDs which are used by the backend to monitor the latestLandscape which should not be used again to have unique IDs so that is why we start with a high value in ID 
	//TODO: find a way to have a semiglobal variable
	//let idCounter = 10000,

	model() {

	  const landscape = this.get('store').createRecord('landscape',{
		  "timestamp": Math.floor(Math.random() * 100000),
		  "id": Math.floor(Math.random() * 100000 + 10000)
	  });

	  const adapterOptions = {filename:"filenametest"};

	  landscape.save();
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
				"id": Math.floor(Math.random() * 100000 + 10000)
			});	
			this.get('controller.model.systems').addObject(system);
			landscape.save();
			landscape.get('systems').addObject(system);
			this.set('modellRepo.modellLandscape', landscape);
			this.get('renderingService').redrawScene();
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
					"id": Math.floor(Math.random() * 100000 + 10000)
			  		});
					system.get('nodegroups').addObject(nodeGroup);

					landscape.save();
					this.set('modellRepo.modellLandscape', landscape);
					changed = true;
					this.get('renderingService').redrawScene();
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
							"id": Math.floor(Math.random() * 100000 + 10000)
						});
						nodegroup.get('nodes').addObject(node);
						for(let h = 0; h < nodegroup.get('nodes').objectAt(0).get('applications').length; h++){
							const app = this.get('store').createRecord('application',{
								"name": nodegroup.get('nodes').objectAt(0).get('applications').objectAt(h).name,
								"parent": node,
								"programmingLanguage": "Java",
								"lastUsage": Date.now(),
								"id": Math.floor(Math.random() * 100000 + 10000)
							});
							node.get('applications').addObject(app);
							landscape.save();
							this.set('modellRepo.modellLandscape', landscape);
							this.get('renderingService').redrawScene();
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
		
		const landscapeRecord = landscape;
		
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
						let string = document.getElementById('nAN').value;
						string = string.bold();
						this.showAlertifyMessage("There is already an application named " + string + " in that nodegroup.");
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
						"lastUsage": Date.now(),
						"id": Math.floor(Math.random() * 100000 + 10000)
					});
					node.get('applications').addObject(app);
					landscape.save();
					this.set('modellRepo.modellLandscape', landscape);
					this.get('renderingService').redrawScene();
				}else{break;}
			}
			
		}
		
	},

	delete(landscape){
		//if there is a system by the name of System remove it
		//TODO:overhaul
		let deleted = false;
		for(let i=0; i < landscape.get('systems').length;i++){
			if(landscape.get('systems').objectAt(i).get('name') === document.getElementById('nSN').value){
				landscape.get('systems').removeObject(landscape.get('systems').objectAt(i));
				deleted = true;
				break;
			}
		}
		if(deleted === false){
			let string = document.getElementById('nSN').value;
			string = string.bold();
			this.showAlertifyMessage("There is no system called " + string + " , therefor no system can be deleted.");
		}else{
			console.log(landscape.get('outgoingApplicationCommunications').length);
			for(let i=0; i < landscape.get('outgoingApplicationCommunications').length;i++){
				if(landscape.get('outgoingApplicationCommunications').objectAt(i).get('sourceApplication').get('parent').get('parent').get('parent').get('name') === document.getElementById('nSN').value || landscape.get('outgoingApplicationCommunications').objectAt(i).get('targetApplication').get('parent').get('parent').get('parent').get('name') === document.getElementById('nSN').value){
					landscape.get('outgoingApplicationCommunications').removeObject(landscape.get('outgoingApplicationCommunications').objectAt(i));
					console.log("ich habe etwas entfernt! : " + i);
				}
			}
			this.set('modellRepo.modellLandscape', null);
			this.get('renderingService').redrawScene();
			this.set('modellRepo.modellLandscape', landscape);
			this.get('renderingService').redrawScene();
		}
	},


	communicationActivate(landscape){
		let application1 = null;
		let application2 = null;
		//find the application1
		for(let i=0; i<landscape.get('systems').length; i++){
			if(landscape.get('systems').objectAt(i).name === document.getElementById('cPS1').value){
				for(let j=0; j<landscape.get('systems').objectAt(i).get('nodegroups').length; j++){
					if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).name === document.getElementById('cPNG1').value){
						for(let k =0; k<landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').length; k++){
							if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).name === document.getElementById('cPN1').value){
								for(let l=0; l < landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').length;l++){
									if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').objectAt(l).name === document.getElementById('cPA1').value){
										application1 = landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').objectAt(l);
										break;
									}
									else if (l === landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').length - 1){
										this.showAlertifyMessage("Your first CommunicationPartner, could not be found.(A)");
									}
								}
								break;
							}
							else if(k === landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').length - 1){
								this.showAlertifyMessage("Your first CommunicationPartner, could not be found.(N)");
							}
						}
						break;
					}
					else if(j === landscape.get('systems').objectAt(i).get('nodegroups').length - 1){
						this.showAlertifyMessage("Your first CommunicationPartner, could not be found.(NG)");
					}
				}
				break;
			}
			else if (i === landscape.get('systems').length - 1){
				this.showAlertifyMessage("Your first CommunicationPartner, could not be found.(S)");
			}
		}

		//find application2
		for(let i=0; i<landscape.get('systems').length; i++){
			if(landscape.get('systems').objectAt(i).name === document.getElementById('cPS2').value){
				for(let j=0; j<landscape.get('systems').objectAt(i).get('nodegroups').length; j++){
					if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).name === document.getElementById('cPNG2').value){
						for(let k =0; k<landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').length; k++){
							if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).name === document.getElementById('cPN2').value){
								for(let l=0; l < landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').length;l++){
									if(landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').objectAt(l).name === document.getElementById('cPA2').value){
										application2 = landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').objectAt(l);
										break;
									}
									else if (l === landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').objectAt(k).get('applications').length - 1){
										this.showAlertifyMessage("Your second CommunicationPartner, could not be found.(A)");
									}
								}
								break;
							}
							else if(k === landscape.get('systems').objectAt(i).get('nodegroups').objectAt(j).get('nodes').length - 1){
								this.showAlertifyMessage("Your second CommunicationPartner, could not be found.(N)");
							}
						}
						break;
					}
					else if(j === landscape.get('systems').objectAt(i).get('nodegroups').length - 1){
						this.showAlertifyMessage("Your second CommunicationPartner, could not be found.(NG)");
					}
				}
				break;
			}
			else if (i === landscape.get('systems').length - 1){
				this.showAlertifyMessage("Your second CommunicationPartner, could not be found.(S)");
			}
		}

		//make them communicate via outgoingApplicationCommunications and inverse: 'sourceApplication'
		const communication1 = this.get('store').createRecord('applicationcommunication', {
			"requests": 100,
			"averageResponseTime": Math.floor(Math.random() * 50),
			"id": Math.floor(Math.random() * 100000 + 10000),
			"technology": "PERL",

			"sourceApplication": application1,

			"targetApplication": application2
		});
		application1.get('outgoingApplicationCommunications').addObject(communication1);

		landscape.get('outgoingApplicationCommunications').addObject(communication1);

		landscape.save();
		this.set('modellRepo.modellLandscape', landscape);
		this.get('renderingService').redrawScene();
	},

	switchComP(){
		let cPS1 = document.getElementById('cPS1').value;
		let cPNG1 = document.getElementById('cPNG1').value;
		let cPN1 = document.getElementById('cPN1').value;
		let cPA1 = document.getElementById('cPA1').value;
		
		document.getElementById('cPS1').value = document.getElementById('cPS2').value;
		document.getElementById('cPNG1').value = document.getElementById('cPNG2').value;
		document.getElementById('cPN1').value = document.getElementById('cPN2').value;
		document.getElementById('cPA1').value = document.getElementById('cPA2').value;

		document.getElementById('cPS2').value = cPS1;
		document.getElementById('cPNG2').value = cPNG1;
		document.getElementById('cPN2').value = cPN1;
		document.getElementById('cPA2').value = cPA1;
	},

    resetRoute() {
      // your cleanup code here
    }
  }

});

