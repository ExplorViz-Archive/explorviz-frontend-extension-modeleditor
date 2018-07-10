import BaseRoute from 'explorviz-frontend/routes/base-route';
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

		landscape.save();
		if(!this.get('modellRepo.modellLandscape')) {
				this.set('modellRepo.modellLandscape', landscape);
		}
		return landscape;
	},
	actions: {
		// @Override BaseRoute
		//
		/*
		newModel(landscape){
			//TODO: find the name in document.getElementById('nMN').value and set it to the model timestamp!

		},
		*/

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
				this.get('modellRepo.modellLandscape').save();
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
						"id": Math.floor(Math.random() * 100000 + 10000)
						});
						system.get('nodegroups').addObject(nodeGroup);

						landscape.save();
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
							if(nodegroup.get('nodes').objectAt(k).getDisplayName === document.getElementById('nNN').value){
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
							}
							this.set('modellRepo.modellLandscape', landscape);
							this.get('renderingService').reSetupScene(); 
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
				if(nodegroup.get('nodes').length > 0){
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
							this.get('renderingService').reSetupScene();
						}else{break;}
					}
				}else{
					this.send('newNode', landscape);
					this.send('newApplication', landscape);
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
				for(let i=0; i < landscape.get('outgoingApplicationCommunications').length;i++){
					if(landscape.get('outgoingApplicationCommunications').objectAt(i).get('sourceApplication').get('parent').get('parent').get('parent').get('name') === document.getElementById('nSN').value || landscape.get('outgoingApplicationCommunications').objectAt(i).get('targetApplication').get('parent').get('parent').get('parent').get('name') === document.getElementById('nSN').value){
						landscape.get('outgoingApplicationCommunications').removeObject(landscape.get('outgoingApplicationCommunications').objectAt(i));
					}
				}
				this.set('modellRepo.modellLandscape', null);
				this.get('renderingService').redrawScene();
				this.set('modellRepo.modellLandscape', landscape);
				this.get('renderingService').reSetupScene();
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

		newComponentInput(application){
			this.send('newComponent', document.getElementById('nPComponentN').value, document.getElementById('nCComponentN').value, application);
		},

		newComponent(componentParentName, componentName, application){
			self = this;
			if(componentParentName.length !== 0){
				let parent = findComponent(componentParentName, componentName, componentParentName, application.get('components').objectAt(0));

				if(parent != undefined || parent != null){
					const component = this.get('store').createRecord('component', {
						"name": componentName,
						"fullQualifiedName": parent.get('fullQualifiedName') + "." + componentName,
						"parentComponent": parent,
						"id": Math.floor(Math.random() * 100000 + 10000)
					});
					parent.get('children').addObject(component);
					//this.get('modelRepo.modellLandscape').save();
					this.set('modellRepo.modellApplication', application);
					this.get('renderingService').reSetupScene();
				}
			}else{
				//search for doubles
				if(application.get('components').objectAt(0).get('children').length !== 0){
					for(let i = 0; i < application.get('components').objectAt(0).get('children').length; i++){
						if(application.get('components').objectAt(0).get('children').objectAt(i).get('fullQualifiedName') === componentName){
							let cString = componentName;
							cString = cString.bold();
							self.showAlertifyMessage("there already is a component named " + cString);
							break;
						}else if(i === application.get('components').objectAt(0).get('children').length - 1){
							const component = this.get('store').createRecord('component', {
								"name": componentName,
								"fullQualifiedName": componentName,
								"parentComponent": application.get('components').objectAt(0),
								"id": Math.floor(Math.random() * 100000 + 10000)
							});
							application.get('components').objectAt(0).get('children').addObject(component);
							this.set('modellRepo.modellApplication', application);
							this.get('renderingService').reSetupScene();
							break;
						}
					}
				}else{
					const component = this.get('store').createRecord('component', {
						"name": componentName,
						"fullQualifiedName": componentName,
						"parentComponent": application.get('components').objectAt(0),
						"id": Math.floor(Math.random() * 100000 + 10000)
					});
					application.get('components').objectAt(0).get('children').addObject(component);
					this.set('modellRepo.modellApplication', application);
					this.get('renderingService').reSetupScene();
				}
			}
		},

		newClazzInput(application){
			this.send('newClazz', document.getElementById('nPComponentN').value, document.getElementById('nClazzN').value, application);
		},

		newClazz(componentParentName, clazzName, application){
			self = this;
			if(componentParentName.length !== 0){
				let parent = findClazz(componentParentName, clazzName, componentParentName, application.get('components').objectAt(0));
				if(parent != undefined || parent != null){
					const clazz = this.get('store').createRecord('clazz', {
						"name": clazzName,
						"fullQualifiedName": parent.get('fullQualifiedName') + "." + clazzName,
						"parent": parent,
						"instanceCount": 1,
						"id": Math.floor(Math.random() * 100000 + 10000)
					});
					parent.get('clazzes').addObject(clazz);
					//this.get('modelRepo.modellLandscape').save();
					this.set('modellRepo.modellApplication', application);
					this.get('renderingService').reSetupScene();
				}
			}			
		},

		deleteComponent(application){
			
			if(document.getElementById('nPComponentN').value.length !== 0){
				let message = deleteComponent(document.getElementById('nPComponentN').value, application.get('components').objectAt(0));
				this.showAlertifyMessage(message);
			}
			this.set('modellRepo.modellApplication', application);
			this.get('renderingService').reSetupScene();
		},

		deleteClazz(application){

			if(document.getElementById('nPComponentN').value.length !== 0){
				let message = deleteClazz(document.getElementById('nPComponentN').value, document.getElementById('nClazzN').value, application.get('components').objectAt(0));
				this.showAlertifyMessage(message);
			}
			this.set('modellRepo.modellApplication', application);
			this.get('renderingService').reSetupScene();
		},

		advanced(application){
			if(document.getElementById('advanced').value === "only if you are advanced!"){
				this.showAlertifyMessage("you are not advanced enough!");
			}
			//example input: test+testcom+aloha;test+testcom+means;test+testcom+family;hola;family+test
			let input = document.getElementById('advanced').value.split(";");
			let componentParentName, componentName, clazzName;
			for(let inputelem = 0; inputelem < input.length; inputelem++){

				input[inputelem] = input[inputelem].split("+");
			}
			for(let inputelem = 0; inputelem < input.length; inputelem++){
				for(let creationelem = 0; creationelem < input[inputelem].length; creationelem++){
					if(creationelem === 0){
						componentParentName = "";
					}else{
						componentParentName = "";
						for(let i = 0; i < creationelem; i++){
							if(i > 0){
								componentParentName += ".";
							}
							componentParentName += input[inputelem][i];
						}
					}
					if(input[inputelem][creationelem].search("#") === -1){
						componentName = input[inputelem][creationelem];
						this.send('newComponent', componentParentName, componentName, application);
					}else{
						clazzName = input[inputelem][creationelem].slice(1);
						this.send('newClazz', componentParentName, clazzName, application);
					}
				}
			}
		},

		resetRoute() {
		// your cleanup code here
		},

		switchLandscape(){
			this.set('modellRepo.modellApplication', null);
		}

	}

});

function findComponent(fullQualifiedName, componentName, componentParentName, component){
	let returnvalue;
	for(let i = 0; i < component.get('children').length; i++){
		if(component.get('children').objectAt(i).get('fullQualifiedName') === fullQualifiedName){
			if(component.get('children').objectAt(i).get('children')){
				for(let j =0; j < component.get('children').objectAt(i).get('children').length; j++){
					if((fullQualifiedName + "." + componentName) === component.get('children').objectAt(i).get('children').objectAt(j).get('fullQualifiedName')){
						let cString = componentName;
						cString = cString.bold();
						let pString = componentParentName;
						pString = pString.bold();
						self.showAlertifyMessage("there already is a component named " + cString + " in the component of " + pString);
						return null;
					}
				}
			}
			return component.get('children').objectAt(i);
		}
		if(component.get('children').objectAt(i).get('children') && returnvalue == undefined) {
			returnvalue = findComponent(fullQualifiedName, componentName, componentParentName, component.get('children').objectAt(i));
		}
	}
	return returnvalue;
}

function findClazz(fullQualifiedName, clazzName, componentParentName, component){
	let returnvalue;
	for(let i = 0; i < component.get('children').length; i++){
		if(component.get('children').objectAt(i).get('fullQualifiedName') === fullQualifiedName){
			if(component.get('children').objectAt(i).get('clazzes')){
				for(let j =0; j < component.get('children').objectAt(i).get('clazzes').length; j++){
					if((fullQualifiedName + "." + clazzName) === component.get('children').objectAt(i).get('clazzes').objectAt(j).get('fullQualifiedName')){
						let cString = clazzName;
						cString = cString.bold();
						let pString = componentParentName;
						pString = pString.bold();
						self.showAlertifyMessage("there already is a class named " + cString + " in the component of " + pString);
						return null;
					}
				}
			}
			return component.get('children').objectAt(i);
		}
		if(component.get('children').objectAt(i).get('children') && returnvalue == undefined){
			returnvalue = findClazz(fullQualifiedName, clazzName, componentParentName, component.get('children').objectAt(i));
		}
	}
	return returnvalue;
}

function deleteComponent(fullQualifiedName, component){
	let returnvalue = "there was nothing found to be deleted";
	for(let i = 0; i < component.get('children').length; i++){
		if(component.get('children').objectAt(i).get('fullQualifiedName') === fullQualifiedName){
			component.get('children').removeObject(component.get('children').objectAt(i));
			let string = fullQualifiedName;
			string = string.bold();
			return string + " was deleted successfully";
		}else{
			returnvalue = deleteComponent(fullQualifiedName, component.get('children').objectAt(i));
		}
	}
	return returnvalue;
}

function deleteClazz(fullQualifiedParentComponentName, clazzName, component){
	let returnvalue = "there was nothing found to be delted";
	for(let i = 0; i < component.get('children').length; i++){
		if(component.get('children').objectAt(i).get('fullQualifiedName') === fullQualifiedParentComponentName){
			if(component.get('children').objectAt(i).get('clazzes')){
				for(let j =0; j < component.get('children').objectAt(i).get('clazzes').length; j++){
					if((fullQualifiedParentComponentName + "." + clazzName) === component.get('children').objectAt(i).get('clazzes').objectAt(j).get('fullQualifiedName')){
						component.get('children').objectAt(i).get('clazzes').removeObject(component.get('children').objectAt(i).get('clazzes').objectAt(j));
						let string = fullQualifiedParentComponentName + "." + clazzName;
						string = string.bold();
						return string + " was deleted successfully";
					}
				}
			}
		}
		if(component.get('children').objectAt(i).get('children')){
			returnvalue = deleteClazz(fullQualifiedParentComponentName, clazzName, component.get('children').objectAt(i));
		}
	}
	return returnvalue;
}